#!/bin/sh
# shellcheck shell=dash

#
# Downloads build artifacts from buildkite.
#
# Usage: ./artifact-download.sh
#

set -e

cd "$(dirname "$0")/../"

echo '--- Downloading build artifacts'

# Prepare the artifacts folder:
rm -rf build/artifacts
mkdir -p build/artifacts

# Download artifacts:
buildkite-agent artifact download "*.tar.gz" .

# Remvoe existing artifacts content:
rm -rf build/node_modules dist public/static/css public/static/js

# Extract artifacts:
for FILE in build/artifacts/*.tar.gz; do
  tar -xf "$FILE"
done

echo # Newline for better readability
