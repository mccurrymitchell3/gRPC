FROM node:8-alpine

WORKDIR ${HOME}/app

ADD server ${HOME}/app/server

ADD ping-pong.proto ${HOME}/app

RUN npm rebuild --prefix server

RUN npm install --prefix server

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.0 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

EXPOSE 50051

CMD [ "npm", "start", "--prefix", "server" ]
