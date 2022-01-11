#!/bin/sh

set -e

cd "$(dirname "$0")/../"

rm -rf public/static/css
mkdir ./public/static/css

[ "$NODE_ENV" = "production" ] && output="prod.min.css" || output="bundle.dev.css"

`yarn bin`/postcss public/static/css-src/bundle.dev.css -o public/static/css/${output} ${@}
