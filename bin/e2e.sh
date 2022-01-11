#!/bin/sh
# shellcheck shell=dash

#
# Run the e2e tests in a docker environment.
# Add the --update argument to update the docker images before the tests.
# Add the --vnc argument to run the tests in debug mode with VNC access.
# Add the --log CONTAINER option to write container logs to file.
#
# Usage: ./e2e.sh [--update] [--vnc] [--log container1,container2,...]
#

# Normalizes according to docker-compose project naming rules:
normalize() {
  tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]//g'
}

compose() {
  docker-compose -p "$PROJECT_NAME" "$@"
}

wait_for_vnc() {
  compose run --rm --entrypoint wait-for nightwatch chromedriver:5900
}

vnc_prompt() {
  echo '--- Providing VNC access'
  local open_vnc
  # The command to open the VNC client:
  open_vnc=$(printf 'open vnc://user:secret@%s:%s' \
    "$(echo "${DOCKER_HOST:-localhost}" | sed 's#.*/##;s#:.*##')" \
    "${VNC_PORT:-5900}")
  wait_for_vnc || cleanup
  echo
  # Try to open the VNC client via command-line:
  if $open_vnc > /dev/null 2>&1; then
    return
  fi
  # Otherwise display a prompt:
  echo "$open_vnc"
  echo
  echo 'Press Enter to continue...'
  read -r _
}

update() {
  echo '--- Updating docker images'
  compose pull > /dev/null
  echo # Newline for better readability
}

startup() {
  echo '--- Starting docker environment'
  compose up -d chromedriver
  echo # Newline for better readability
}

log() {
  [ "$#" = 0 ] && return
  mkdir -p "logs/$NOW"
  local container
  for container in "$@"; do
    docker logs -f "$(compose ps -q "$container")" \
      > "logs/$NOW/$container-stdout.log" \
      2> "logs/$NOW/$container-stderr.log" &
  done
}

run_tests() {
  echo '+++ Running tests'
  # Must run as root on Buildkite to avoid permission issues.
  # The root user is remapped to the buildkite-agent via userns-remap:
  # https://docs.docker.com/engine/security/userns-remap/
  if [ "$BUILDKITE" = true ]; then
    compose run --user root nightwatch "$@"
  else
    compose run nightwatch "$@"
  fi
}

# Removes images built via docker-compose config:
cleanup_docker_images() {
  printf 'Removing %s image builds ... ' "$PROJECT_NAME"
  # shellcheck disable=SC2046
  docker rmi \
    $(printf "${PROJECT_NAME}_%s\n" $(compose config --services)) \
    >/dev/null 2>&1
  echo 'done'
}

cleanup() {
  local status=$?
  echo # Newline for better readability
  echo '--- Cleaning up'
  compose down -v
  cleanup_docker_images
  exit $status
}

# The project directory:
PROJECT_DIR=$(cd "$(dirname "$0")/.." && pwd)

# ISO 8601 date:
NOW=$(date '+%Y-%m-%dT%H:%M:%SZ')

# Randomize and normalize the project name:
PROJECT_NAME="$(echo "$(basename "$PROJECT_DIR")_$NOW" | normalize)"

# Enter the e2e tests directory:
cd "$PROJECT_DIR/test/e2e" || exit 1

# Clean up on SIGINT and SIGTERM:
trap 'cleanup' INT TERM

VNC_PORT_MAPPING=5900

while [ $# -gt 0 ]; do
  case "$1" in
    --update)
      UPDATE_ENABLED=true
      shift
      continue
      ;;
    --vnc)
      ENABLE_VNC=true
      VNC_PORT_MAPPING="${VNC_PORT:-5900}:5900"
      shift
      continue
      ;;
    --record)
      EXPOSE_X11=true
      VIDEOS_ENABLED=true
      shift
      continue
      ;;
    --log)
      LOG_CONTAINERS=$(echo "$2" | tr , ' ')
      shift 2
      continue
      ;;
    *)
      break
  esac
done

export EXPOSE_X11
export VIDEOS_ENABLED
export ENABLE_VNC
export VNC_PORT_MAPPING

if [ "$UPDATE_ENABLED" = true ]; then
  update
fi

startup

if [ "$ENABLE_VNC" = true ]; then
  vnc_prompt
fi

if [ ! -z "$LOG_CONTAINERS" ]; then
  # shellcheck disable=SC2086
  log $LOG_CONTAINERS
fi

run_tests "$@"

cleanup
