#!/bin/sh
protoc \
--include_imports \
--include_source_info \
--proto_path=/Users/lg185110/repos/googleapis/ \
--proto_path=. \
--descriptor_set_out=./endpoint/ping-pong_descriptor.pb \
ping-pong.proto

export PROTO_DESC=`base64 -i ./endpoint/ping-pong_descriptor.pb`

sed -i '.bak' 's@PROTO_DESC@'"$PROTO_DESC"'@' ./helm/grpc-demo/templates/envoy-filter.yaml