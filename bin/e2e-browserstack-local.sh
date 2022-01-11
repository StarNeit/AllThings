#!/bin/sh
# shellcheck shell=dash

#
# Run the e2e tests with browserstack against the staging environment.
#
# Usage: ./e2e-browserstack.sh
#

compose() {
  docker-compose -f browserstack-local.yml "$@"
}

cleanup() {
  local status=$?
  compose down -v
  exit $status
}

# Enter the e2e tests directory:
cd "$(dirname "$0")/../test/e2e" || exit 1

# Generate a random ID:
BROWSERSTACK_LOCAL_ID=$(hexdump -n 16 -v -e '/1 "%02X"' /dev/urandom)
export BROWSERSTACK_LOCAL_ID

# Clean up on SIGINT and SIGTERM:
trap 'cleanup' INT TERM

# Start the browserstack-local container:
compose up -d browserstack

# Wait for browserstack-local to connect:
sleep 1

# Run the tests:
compose run --rm nightwatch "$@"

cleanup
