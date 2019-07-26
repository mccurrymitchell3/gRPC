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

function pingPong() {
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

function pingPongRally() {
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
    const doForEach = (x) => {
        if (x === names.length) {
            call.end();
        } else {
            console.log('Sending ' + names[x]);
            call.write({ ping: names[x] });
            setTimeout(() => {
                doForEach(x + 1);
            }, 1000);
        }
    };

    doForEach(0);
}

function main() {
    //ping();
    //pingPong();
    pingPongRally();
}

main();