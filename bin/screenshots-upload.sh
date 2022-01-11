#!/bin/sh

#
# Syncs screenshots from the e2e directory to s3://allthings-screenshots.
#
# Usage: ./screenshots-upload.sh [--force]
#
# Only syncs screenshots for tagged commits unless --force is given.
#

set -e

cd "$(dirname "$0")/../"

if [ "$1" != "--force" ]; then
  # Get the tag for the current commit:
  TAG="$(git describe --exact-match --tags 2> /dev/null || true)"
  # Exit if this is not a tagged commit or it is a pre-release:
  if [ -z "$TAG" ] || [ "${TAG#*-}" != "$TAG" ]; then
    # Remove reference images without a comparison image:
    find test/e2e/screenshots -name '*-ref.png' -exec sh -c \
      'f="${0%-ref.png}-new.png"; test -f "$f" || rm "$0"' {} \;
    exit
  fi
fi

echo '--- Uploading reference screenshots'

# Use the new files as reference images:
find test/e2e/screenshots -name '*-new.png' -exec sh -c \
  'f="${0%-new.png}-ref.png"; rm "$f"; mv "$0" "$f"' {} \;

ORIGIN_URL=$(git config --get remote.origin.url)
GITHUB_REPO=$(echo "$ORIGIN_URL" | sed 's|.*/||;s|\.[^\.]*$||')

# Sync the reference images to the s3 bucket:
aws s3 sync test/e2e/screenshots s3://allthings-screenshots/"$GITHUB_REPO" \
  --exclude '*' \
  --include '*-ref.png' \
  --acl bucket-owner-full-control

# Delete the sreenshots directory:
rm -rf test/e2e/screenshots

echo # Newline for better readability
