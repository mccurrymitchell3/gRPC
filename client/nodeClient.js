// requirements
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const path = require('path');

// gRPC client
const pingPongProtoPath = path.join(__dirname, '..', 'ping-pong.proto');
const pingPongProtoDefinition = protoLoader.loadSync(pingPongProtoPath);
const pingPongPackageDefinition = grpc.loadPackageDefinition(pingPongProtoDefinition);

let serverAddr = process.argv[3];
if (!serverAddr) {
    serverAddr = '35.226.87.43:50051';
}
const client = new pingPongPackageDefinition.PingPongService(
    serverAddr, grpc.credentials.createInsecure());

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
        'Wayne',
        'Seth',
        'Sean',
        'Bharath'
    ];
    names.forEach((name) => {
        console.log('Sending ' + name);
        call.write({ ping: name });
    });
    call.end();
}

function pingPongRally() {
    let call = client.PingPongStream();
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
        'Wayne',
        'Seth',
        'Sean',
        'Bharath'
    ];
    let index = 1;
    call.on('data', function(reply) {
        console.log(reply.pong);
        if (index < names.length) {
            setTimeout(() => {
                console.log('Sending ' + names[index] + ' ...');
                call.write({ ping: names[index] });
                index++;
            }, 750);
        } else {
            call.end();
        }
    });
    console.log('Sending ' + names[0]);
    call.write({ ping: names[0] });

    // linearly iterates over the name list
    // const doForEach = (x) => {
    //     if (x === names.length) {
    //         call.end();
    //     } else {
    //         console.log('Sending ' + names[x]);
    //         call.write({ ping: names[x] });
    //         setTimeout(() => {
    //             doForEach(x + 1);
    //         }, 1000);
    //     }
    // };
    //
    // doForEach(0);
}

function main() {
    const arg = process.argv[2];
    if (arg === 'ping') {
        ping();
    } else if (arg === 'pings') {
        (Array.from(Array(10).keys())).forEach(() => {
            ping()
        });
    } else if (arg === 'pingpong') {
        pingPong();
    } else if (arg === 'rally') {
        pingPongRally();
    } else if (arg === 'all') {
        ping();
        (Array.from(Array(10).keys())).forEach(() => {
            ping()
        });
        pingPong();
        pingPongRally();
    } else {
        console.log('Needed one argument (ping, pingpong, rally or all)');
    }
}

main();