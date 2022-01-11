FROM allthings/node

COPY . /srv/www/app
WORKDIR /srv/www/app

ENV NODE_ENV production

USER root
RUN yarn install --production=false --network-concurrency=3 --frozen-lockfile \
  && rm -rf node_modules yarn.lock \
  && mv package.json package.json~ \
  && yarn add \
  serverless \
  serverless-offline \
  && mv package.json~ package.json \
  && rm -rf "$(yarn cache dir)"
USER node

# Fix to allow running the container in read-only mode:
RUN mkdir -p /home/node/.aws \
  && touch /home/node/.aws/credentials \
  && echo "{}" > /home/node/.serverlessrc

ENV PATH "$PATH:/srv/www/app/node_modules/.bin"

ENTRYPOINT ["tini", "-g", "--", "sls", "offline", "start", "--host", "0.0.0.0"]

CMD ["--skipCacheInvalidation"]

EXPOSE 3000

HEALTHCHECK --interval=5s CMD ["/srv/www/app/bin/healthcheck.js"]
