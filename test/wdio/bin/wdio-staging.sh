#!/bin/sh

cd "$(dirname "$0")/../" || exit

export COMPOSE_FILE=wdio.yml
export ENVIRONMENT=staging

exec docker-compose run --rm wdio "$@"
