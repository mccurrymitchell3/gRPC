// requirements
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const path = require('path');

// gRPC client
const pingPongProtoPath = path.join(__dirname + '..', '..', 'ping-pong.proto');
const pingPongProtoDefinition = protoLoader.loadSync(pingPongProtoPath);
const pingPongPackageDefinition = grpc.loadPackageDefinition(pingPongProtoDefinition);
const client = new pingPongPackageDefinition.PingPongService(
    'localhost:50051', grpc.credentials.createInsecure());

// handlers
function ping() {
    const payload = { ping: 'Mitch' };
    client.PingPong(payload, (err, result) => {
        if (err) {
            console.log(`Failed to Ping.\n${err}`);
        }
        else {
            console.log(result);
        }
    });
}

function main() {
    ping();
}

main();