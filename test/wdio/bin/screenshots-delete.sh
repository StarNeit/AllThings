#!/bin/sh

#
# Removes all screenshots for the given browser config from S3.
#
# Usage: ./screenshots-delete.sh browser
#

set -e

cd "$(dirname "$0")/../"

BROWSER=${1:-chrome}

# Remove all screenshots for the current browser config from S3:
aws s3 rm \
  "s3://allthings-screenshots/wdio/${PROJECT:-app}" \
  --recursive \
  --exclude '*' \
  --include "*$BROWSER*/*.png"
