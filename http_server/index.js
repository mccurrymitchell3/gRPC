'use strict';

// requirements
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');
const express = require('express');

const app = express();

const backendUri = process.env.ENV_VARIABLE;
let client = null;

// gRPC client
const pingPongProtoPath = path.join(__dirname, 'ping-pong.proto');
const pingPongProtoDefinition = protoLoader.loadSync(pingPongProtoPath);
const pingPongPackageDefinition = grpc.loadPackageDefinition(pingPongProtoDefinition);

if (backendUri) {
    client = new pingPongPackageDefinition.PingPongService(
        backendUri, grpc.credentials.createInsecure());
}

app.get('/', (req, res) => { res.status(200).end() });
app.get('/pingpong/:ping', (req, res) => {
    const payload = { ping: req.params.ping };
    if (client) {
        client.PingPong(payload, (err, result) => {
            if (err) {
                console.log(`Failed to Ping.\n${err}`);
                res.status(400).end();
            }
            else {
                console.log(result.pong);
                res.status(200).send(result.pong);
            }
        });
    } else {
        res.status(404).end();
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
