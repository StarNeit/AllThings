#!/bin/sh

#
# Exports deployment configuration as environment variables.
#
# Uses the (scoped) package name as S3 project directory.
#
# The deployment stage is identified based on the git tag:
# * Untagged commits go to staging.
# * Prerelease tags go to prerelease.
# * Other tags go to production.
# 
# Arguments after the end of options (identified by "--") are executed as
# command, which inherits the exported variables.
#
# Usage: ./deploy-env.sh [-- command args...]
#

STAGE_PREFIX=${STAGE%-*}
export STAGE_PREFIX

# Define AWS IAM deployment role and S3 bucket name:
JQ_SELECT_DEPLOY_PROFILE=".config.$STAGE_PREFIX.deployProfile"
JQ_SELECT_BUCKET=".config.$STAGE_PREFIX.publicS3Bucket"
ROLE="$(jq -r "$JQ_SELECT_DEPLOY_PROFILE" package.json)"
BUCKET="$(jq -r "$JQ_SELECT_BUCKET" package.json)"
export ROLE
export BUCKET
export NODE_ENV=production

export DEPLOYED_BY="$(git config --get user.name) - $(git config --get user.email)"
export DEPLOY_TIME="$(date +"%Y-%m-%d %H:%M:%S")"
export BRANCH_NAME="$(git rev-parse --abbrev-ref HEAD)"
export COMMIT_HASH="$(git rev-parse --short HEAD)"

set -e

cd "$(dirname "$0")/.."

# Retrieve the project name from the (scoped) package name:
PROJECT="$(jq -r '.name | split("/")[-1]' package.json)"
export PROJECT

# Execute the given command:
if [ "$1" = -- ]; then shift; exec "$@"; fi
