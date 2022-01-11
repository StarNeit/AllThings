#!/bin/sh
# shellcheck shell=dash

#
# Run the e2e tests against the dev environment.
#
# Usage: ./e2e-dev.sh [--down]
#
# Without arguments, simply runs the tests via docker-compose run.
# If the --down argument is given, executes docker-compose down.
#

# Enter the e2e tests directory:
cd "$(dirname "$0")/../test/e2e" || exit 1

if [ "$1" = "--down" ]; then
  docker-compose -f dev.yml down -v
  exit $?
fi

echo 'VNC access:'
printf 'open vnc://user:secret@%s:5900\n\n' \
  "$(echo "${DOCKER_HOST:-localhost}" | sed 's#.*/##;s#:.*##')"

# Run the tests:
exec docker-compose -f dev.yml run --rm nightwatch "$@"
