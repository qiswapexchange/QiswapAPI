#!/usr/bin/env bash

set -e

if ! which docker 2>&1 > /dev/null; then
    echo "Please install 'docker' first"
    exit 1
fi

if ! which docker-compose 2>&1 > /dev/null; then
    echo "Please install 'docker-compose' first"
    exit 1
fi

if ! which jq 2>&1 > /dev/null; then
    echo "Please install 'jq' first"
    exit 1
fi

# Identify the container ID for janus
CONTAINER_ID=$(docker container ls | grep -i janus | cut -d' ' -f1)

if [ -z $CONTAINER_ID ]; then
    echo "Please start the Janus container first"
    exit 1
fi

# Inspect the container to identify the host IP address
HOST_IP=$(docker inspect "$CONTAINER_ID" | jq -r .[0].NetworkSettings.Networks[].Gateway)

# Inject the host IP into docker-compose.yml
sed -i -e "s/host.docker.internal/$HOST_IP/g" docker-compose.yml

echo "docker-compose.yaml file updated with Janus Host IP: $HOST_IP"
