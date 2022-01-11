#!/bin/sh

cd "$(dirname "$0")/../" || exit

rm -rf reports/*/

case "$1" in
  '') BROWSER=chrome;;
  -*) BROWSER=chrome;;
   *) BROWSER=$1;;
esac

if [ "$CI" = true ]; then
  echo '--- Downloading reference screenshots'
  bin/screenshots-download.sh "$BROWSER"
  echo '--- Updating docker images'
  docker-compose pull --quiet
fi

cleanup() {
  echo '--- Cleaning up'
  docker-compose down -v
}

# Clean up on SIGINT and SIGTERM:
trap 'cleanup' INT TERM

STARTTIME=$(date +%s)

echo '+++ Running tests'
if [ "$CI" = true ]; then
  # Must run as root on Buildkite to avoid permission issues.
  # The root user is remapped to the buildkite-agent via userns-remap:
  # https://docs.docker.com/engine/security/userns-remap/
  docker-compose run --rm --user root wdio "$@"
else
  docker-compose run --rm wdio "$@"
fi

STATUS=$?

echo '--- Saving logs'
bin/save-logs.sh "$BROWSER"

cleanup

if [ "$CI" = true ]; then
  echo '--- Removing old screenshots'
  bin/screenshots-cleanup.sh "$STARTTIME"
  echo '--- Listing logs'
  bin/display-inline.sh reports/logs log
  echo '+++ Listing videos'
  bin/display-inline.sh reports/videos mp4
  echo '+++ Displaying screenshots'
  bin/display-inline.sh reports/screenshots png
  if [ "$STATUS" -eq 0 ] && [ "$BUILDKITE_BRANCH" = master ]; then
    echo '--- Removing old screenshots from S3'
    bin/screenshots-delete.sh "$BROWSER"
    echo '--- Uploading reference screenshots'
    bin/screenshots-upload.sh "$BROWSER"
  fi
fi

exit $STATUS
