#!/bin/bash

COMPOSE="/usr/local/bin/docker-compose --ansi never"
DOCKER="/usr/bin/docker"

cd /home/ubuntu/qiswap-api/docker
$COMPOSE run certbot renew -v && $COMPOSE kill -s SIGHUP nginx
$DOCKER system prune -af
