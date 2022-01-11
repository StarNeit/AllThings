#!/bin/sh

cd "$(dirname "$0")/../" || exit

export COMPOSE_FILE=wdio.yml:dev.yml

exec docker-compose run --rm wdio "$@"
