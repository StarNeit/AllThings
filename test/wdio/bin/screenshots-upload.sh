#!/bin/sh

#
# Uploads screenshots taken for the given browser config.
#
# Usage: ./screenshots-upload.sh browser
#

set -e

cd "$(dirname "$0")/../"

BROWSER=${1:-chrome}

mkdir -p reports/screenshots
aws s3 sync \
  reports/screenshots \
  "s3://allthings-screenshots/wdio/${PROJECT:-app}" \
  --exclude '*' \
  --include "*$BROWSER*/*.png" \
  --exclude '* original.png' \
  --exclude '* diff.png' \
  --acl bucket-owner-full-control
