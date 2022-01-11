#!/bin/sh

#
# Removes all screenshots that have not been modified after test start.
# Ignores files ending in " original.png".
#
# Usage: ./screenshots-cleanup.sh starttime
#

set -e

cd "$(dirname "$0")/../"

STARTTIME=${1:-0}

DIR=reports/screenshots
EXT=png
ORIGINAL_SUFFIX=" original.$EXT"

# shellcheck disable=SC2039
find "$DIR" -name "*.$EXT" -print0 | while IFS= read -r -d '' FILE; do
  if [ "$FILE" != "${FILE%$ORIGINAL_SUFFIX}" ]; then continue; fi
  if [ "$(date -r "$FILE" +%s)" -lt "$STARTTIME" ]; then
    rm -f "$FILE"
  fi
done
