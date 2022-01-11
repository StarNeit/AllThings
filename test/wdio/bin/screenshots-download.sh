#!/bin/sh

#
# Downloads screenshots taken for the given browser config.
#
# Usage: ./screenshots-download.sh browser
#

set -e

cd "$(dirname "$0")/../"

BROWSER=${1:-chrome}

mkdir -p reports/screenshots
aws s3 sync \
  "s3://allthings-screenshots/wdio/${PROJECT:-app}" \
  reports/screenshots \
  --exclude '*' \
  --include "*$BROWSER*/*.png"
