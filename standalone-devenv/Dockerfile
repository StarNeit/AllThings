# Creates a Docker image for use in a standalone development environment

FROM alpine:3.11

# Upgrade all packages to the latest version:
RUN apk --no-cache upgrade

RUN apk --no-cache add \
  tini \
  nodejs \
  npm \
  yarn

# Add node user/group with uid/gid 1000:
# This is a workaround for boot2docker issue #581, see
# https://github.com/boot2docker/boot2docker/issues/581
RUN adduser -D -u 1000 node

USER node

WORKDIR /srv/www

ENV NODE_ENV development

ENV PORT 8080


ENTRYPOINT ["tini", "-g", "--", "./node_modules/.bin/sls", "offline", "start", "--host", "0.0.0.0", "--port", "8080"]

CMD ["--useSeparateProcesses"]

EXPOSE 8080

HEALTHCHECK --interval=30s --retries=12 CMD ["/srv/www/app/bin/healthcheck.js"]
