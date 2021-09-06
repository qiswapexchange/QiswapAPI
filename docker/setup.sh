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

# Inspect the container to identify JANUS http listening port
JANUS_PORT=$(docker inspect janus_mainnet | jq -r .[0].NetworkSettings.Ports[] | grep -oE '[0-9]+{2,}' | sort -u)

echo "Janus Port: $JANUS_PORT"

# Create the nginx container
docker-compose up --no-start nginx

# Start nginx so we can inspect it
docker-compose start nginx

# Identify the container ID
CONTAINER_ID=$(docker container ls | grep nginx | cut -d' ' -f1)

# Inspect the container to identify the host IP address
HOST_IP=$(docker inspect "$CONTAINER_ID" | jq -r .[0].NetworkSettings.Networks[].Gateway)

echo "Host IP: $HOST_IP"

# Inject the host IP and JANUS port into ../utils/config.js

cat << EOF > ../utils/config.js
const MORGAN_LEVEL="dev";
const HTTPPROVIDER="http://$HOST_IP:$JANUS_PORT";
module.exports = { MORGAN_LEVEL , HTTPPROVIDER }
EOF

echo "../utils/config.js file updated with Janus Host IP: $HOST_IP and Port: $JANUS_PORT"

function stop_nginx {
    # Ensure graph-node is stopped
    docker-compose stop nginx
}

trap stop_nginx EXIT
