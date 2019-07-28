'use strict';

// requirements
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const os = require('os');

const { GrpcHealthCheck, HealthCheckResponse, HealthService } = require('grpc-ts-health-check');

const healthCheckStatusMap = {
    "": HealthCheckResponse.ServingStatus.SERVING
};
const backendUri = process.env.ENV_VARIABLE;
let client = null;

// gRPC client
const pingPongProtoPath = path.join(__dirname, '..', 'ping-pong.proto');
const pingPongProtoDefinition = protoLoader.loadSync(pingPongProtoPath);
const pingPongPackageDefinition = grpc.loadPackageDefinition(pingPongProtoDefinition);

if (backendUri) {
    client = new pingPongPackageDefinition.PingPongService(
        backendUri, grpc.credentials.createInsecure());
}

// grpc service definition
const pingPongServiceProtoPath = path.join(__dirname, '..', 'ping-pong.proto');
const pingPongServiceProtoDefinition = protoLoader.loadSync(pingPongServiceProtoPath);
const pingPongServicePackageDefinition = grpc.loadPackageDefinition(pingPongServiceProtoDefinition);

function PingPong(call, callback) {
    if (client !== null) {
        client.PingPongBackend(call.request, (err, result) => {
            if (err) {
                callback(err, {pong: 'Backend unavailable.'});
            } else {
                callback(null, result);
            }
        });
    } else {
        callback(null, {pong: 'Backend unavailable.'});
    }

}

function PingPongStream(call) {
    call.on('data', function(name) {
        let reply = `Hello, ${name.ping}! This is ${os.hostname()}.`;
        call.write({ pong: reply });
    });
    call.on('end', function() {
        call.end();
    });
}

function PingPongBackend(call, callback) {
    const ping = call.request.ping;
    let pong = `Hello, ${ping}! This is ${os.hostname()}.`;
    callback(null, {pong: pong});
}

function main() {
    const server = new grpc.Server();
    // gRPC service
    server.addService(pingPongServicePackageDefinition.PingPongService.service, {
        PingPong,
        PingPongStream,
        PingPongBackend
    });

    // gRPC health check
    // Register the health service
    const grpcHealthCheck = new GrpcHealthCheck(healthCheckStatusMap);

    server.addService(HealthService, grpcHealthCheck);

    // gRPC server
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('PingPong gRPC server running at http://0.0.0.0:50051');
}

main();