#!/bin/sh

#
# Syncs screenshots from s3://allthings-screenshots to the e2e directory.
#
# Usage: ./screenshots-download.sh
#

set -e

cd "$(dirname "$0")/../"

echo '--- Downloading reference screenshots'

ORIGIN_URL=$(git config --get remote.origin.url)
GITHUB_REPO=$(echo "$ORIGIN_URL" | sed 's|.*/||;s|\.[^\.]*$||')

aws s3 sync s3://allthings-screenshots/"$GITHUB_REPO" test/e2e/screenshots \
  --delete

echo # Newline for better readability
