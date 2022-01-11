#!/bin/sh

#
# Creates build artifacts for the Continuous Integration environment.
#
# Usage: ./artifacts-build.sh
#

set -e

cd "$(dirname "$0")/../"

echo '+++ Building project files'
./bin/docker-build.sh

echo # Newline for better readability

echo '+++ Packaging build artifacts'

# Remove any existing build artifacts
rm -rf build/artifacts
mkdir -p build/artifacts

for FOLDER in  build/node_modules dist public/static/css public/static/js; do
  printf "Packaging %s folder ... " "$FOLDER"
  tar -czf "build/artifacts/$(basename $FOLDER)".tar.gz "$FOLDER"/
  echo 'done'
done
