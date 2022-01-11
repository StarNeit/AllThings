#!/bin/sh

#
# Waits for an URL to become available before executing a given command.
#
# Usage: ./wait-for-url.sh url [command [args...]]
#

set -e

# Timeout in seconds to wait for the URL to be ready:
TIMEOUT=${TIMEOUT:-120}
# Interval between tests if the URL is ready:
INTERVAL=${INTERVAL:-5}

URL=${1:?}
shift

wait_for_url() {
  url="$1"
  printf 'Waiting for %s to become available ... ' "$url"
  timeout=$(($(date +%s)+TIMEOUT))
  while ! curl -sf -o /dev/null "$url"; do
    if [ "$(date +%s)" -gt "$timeout" ]; then
      echo 'timeout'
      return 1
    fi
    sleep "$INTERVAL"
  done
  echo 'done'
}

echo "--- Checking URL status"
wait_for_url "$URL"

# Execute the given command:
"$@"
