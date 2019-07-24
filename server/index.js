'use strict';

// requirements
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

// grpc service definition
const pingPongServiceProtoPath = path.join(__dirname, '..', 'ping-pong.proto');
const pingPongServiceProtoDefinition = protoLoader.loadSync(pingPongServiceProtoPath);
const pingPongServicePackageDefinition = grpc.loadPackageDefinition(pingPongServiceProtoDefinition);

function PingPong() {}

function main() {
    const server = new grpc.Server();
    // gRPC service
    server.addService(pingPongServicePackageDefinition.PingPongService.service, {
        PingPong
    });

    // gRPC server
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('gRPC server running at http://0.0.0.0:50051');
}

main();