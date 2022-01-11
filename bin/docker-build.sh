#!/bin/sh

export NODE_ENV=production

./bin/docker-node.sh yarn install \
  --production=false \
  --frozen-lockfile \
