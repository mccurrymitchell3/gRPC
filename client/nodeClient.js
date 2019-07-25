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
    console.log('Pinging');
    client.PingPong(payload, (err, result) => {
        if (err) {
            console.log(`Failed to Ping.\n${err}`);
        }
        else {
            console.log(result.pong);
        }
    });
}

function bidirectionalStream() {
    let call = client.PingPongStream();
    call.on('data', function(reply) {
        console.log(reply.pong);
    });

    let names = [
        'Mitch',
        'Luwei',
        'James',
        'Matt',
        'Vinny',
        'Simon',
        'Yiran',
        'Prashant',
        'Moumita',
        'Wayne'
    ];
    names.forEach((name) => {
        console.log('Sending ' + name);
        call.write({ ping: name });
    });
    call.end();
}

function main() {
    //ping();
    bidirectionalStream();
}

main();