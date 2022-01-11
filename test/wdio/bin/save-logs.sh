#!/bin/sh

set -e

cd "$(dirname "$0")/../"

BROWSER=$1

mkdir -p "reports/logs/$BROWSER"

for CONTAINER in $(docker-compose ps | awk 'NR>2 { print $1 }'); do
  # Extract the service name (dir_service_1) and add the logs dir prefix:
  LOGFILE=${CONTAINER#*_}
  LOGFILE=reports/logs/$BROWSER/${LOGFILE%_*}
  docker logs "$CONTAINER" 1> "$LOGFILE.out.log" 2> "$LOGFILE.err.log"
done
