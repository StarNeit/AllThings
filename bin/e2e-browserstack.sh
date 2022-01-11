#!/bin/sh
# shellcheck shell=dash

#
# Run the e2e tests with browserstack against the staging environment.
#
# Usage: ./e2e-browserstack.sh
#

# Enter the e2e tests directory:
cd "$(dirname "$0")/../test/e2e" || exit 1

# Create a unique id for the docker-compose project name:
ID=$(hexdump -n 16 -v -e '/1 "%02X"' /dev/urandom)

# Run the tests:
exec docker-compose -f browserstack.yml -p "$ID" run --rm nightwatch "$@"
