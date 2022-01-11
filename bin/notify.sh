#!/bin/sh

#
# Triggers the given pipeline.
#
# Usage: ./notify.sh [--no-color] pipeline [branch]
#
# The --no-color argument allows to disable the default color output.
#

set -e

cd "$(dirname "$0")/../"

# Colorize the output by default:
if [ "$1" != '--no-color' ]; then
  c031='\033[0;31m' # red
  c032='\033[0;32m' # green
  c033='\033[0;33m' # yellow
  c0='\033[0m' # no color
else
  shift 1
  c031=
  c032=
  c033=
  c0=
fi

PIPELINE=$1
BRANCH=${2:-master}

# Checks if the given variable is set:
check_variable() {
  if [ -z "$1" ]; then
    printf "${c031}Error${c0}: Missing ${c033}%s${c0}.\n" "$2" >&2
    exit 1
  fi
}

check_variable "$PIPELINE" 'pipeline argument'
check_variable "$BUILDKITE_ACCESS_TOKEN" BUILDKITE_ACCESS_TOKEN
check_variable "$BUILDKITE_ORGANIZATION_SLUG" BUILDKITE_ORGANIZATION_SLUG

echo '--- Fetching tags'
git fetch origin 'refs/tags/*:refs/tags/*'

# Retrieve the tag for the current commit:
TAG="$(git describe --exact-match --tags 2> /dev/null || true)"

echo # Newline for better readability

APP_TYPE=:nodejs:
APP_NAME=$(basename "$PWD")

if [ -z "$TAG" ]; then
  RELEASE_TYPE=commit
elif [ "${TAG#*-}" != "$TAG" ]; then
  RELEASE_TYPE=pre-release
else
  RELEASE_TYPE=release
fi

echo "+++ Triggering $PIPELINE pipeline"
RESULT=$(curl \
  -s \
  -H "Authorization: Bearer $BUILDKITE_ACCESS_TOKEN" \
  -X POST \
  -F 'commit=HEAD' \
  -F "branch=$BRANCH" \
  -F "message=$APP_TYPE $APP_NAME $RELEASE_TYPE" \
  "$(printf \
  'https://api.buildkite.com/v2/organizations/%s/pipelines/%s/builds' \
  "$BUILDKITE_ORGANIZATION_SLUG" "$PIPELINE")"
)

STATE=$(echo "$RESULT" | grep -wm1 state | cut -d '"' -f 4)

if [ -n "$STATE" ]; then
  printf "State: ${c032}%s${c0}\n" "$STATE"
  printf 'URL:   '
  echo "$RESULT" | grep -wm1 web_url | cut -d '"' -f 4
else
  printf "${c031}%s${c0}: " Error >&2
  echo "$RESULT" | grep -wm1 message | cut -d '"' -f 4 >&2
  exit 1
fi
