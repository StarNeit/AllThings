# app [![Build status](https://badge.buildkite.com/966dfdfed4b4f0037bf33098dfeab557b2334ed5e504effd4a.svg)](https://buildkite.com/allthings/app) [![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The ALLTHINGS app — based on [react.js](https://facebook.github.io/react/).

## Content

 * [Prerequisite](#prerequisite)
    + [NodeJS](#nodejs)
    + [Setup](#setup)
    + [Get it running](#get-it-running)
    + [Running in standalone development environment](#running-in-standalone-development-environment)
  * [Overview](#overview)
  * [Redux](#redux)
    + [Store](#store)
    + [Actions](#actions)
    + [Reducers](#reducers)
  * [Developer notes](#developer-notes)
  * [Tests](#tests)
    + [Linting](#linting)
    + [Writing unit tests](#writing-unit-tests)
    + [Writing e2e tests](#writing-e2e-tests)
    + [Running e2e tests](#running-e2e-tests)
  * [Deploying](#deploying)
  * [Testing the legacy bundle in your evergreen browser](#testing-the-legacy-bundle-in-your-evergreen-browser)
  * [Troubleshoot](#troubleshoot)
  * [UI](#ui)
    + [Allthings Elements](#allthings-elements)
    + [Colors](#colors)

## Prerequisite

### NodeJS

As specified in the package.json file, **the node engine must be >= 6.5.0** and **the npm version must be >=3.0.0**.

The best way to manage multiple active NodeJS versions is to use [nvm](https://github.com/creationix/nvm). Please refer to its documentation.

### ⚠️ Note

#### "resolutions" in package.json

```json
"resolutions": {
  "uglifyjs-webpack-plugin/uglify-es": "3.1.6"
}
```

We needed to pin the package `uglify-es` to a specific version because of a bug that occured.
See: https://github.com/allthings/app/pull/1087
This needs to be revisited soon, to make sure we can get rid of this again.


### Setup

```sh
yarn
```

Linux user don't need **fsevents** and should run the following command:

```sh
yarn --ignore-optional
```

### Get it running

#### Create a build

```sh
yarn build
```

This will build 3 bundles:

* Server side build
* Client vendor build (`react`, `redux`, `glamor`, etc. see `webpack/dll/dll.base.config.js`)
* Client side build (with webpack)

Server side code will land into `dist` folder and client side code into `public/static/js`.

#### Create incremental builds

```sh
yarn start
```

This will watch the file system for change inside the `src` folder and trigger an incremental build.

After it was rebuilt the node container will be restarted so that the server side can serve the correct bundle.

*Important:* Webpack DLL is not run in an incremental build. This has to be done either manually by `npm run webpack:dll` or a full build `npm run build`.

If everything worked you can go to [https://app.dev.allthings.me](https://app.dev.allthings.me) and see the app running.

If you are targeting the legacy bundle - by default only the modern one is built - append the **legacy** keyword:

```sh
yarn start legacy
```

#### Reports

If you want to deep dive into the content of the bundles in order to optimize them, set the following environment variable before performing a `yarn build`:

```sh
export WEBPACK_REPORT=1
```
The reports will be generated and opened automatically.

To disable it run:

```sh
unset WEBPACK_REPORT
```


### Running in standalone development environment

```sh
APP_DOMAIN="<your allthings app domain>" \
  OAUTH_CLIENT_ID="<your oauth client id here>" \
  yarn start:standalone
```
Then navigate to [https://app.localhost/](https://app.localhost/)

**Note:** Since the standalone environment uses a self-signed SSL certificate, the first time running the standalone development environment you'll need to confirm an exception to the SSL certificate in your browser. Do this by opening the following two URLs in your browser:

```sh
open https://app.localhost/
open https://app-cdn.localhost/
```

**Note 2:** Your OAuth client must be valid in the Target API Environment and must be a "public" Client with Authorization Code grant allowed. If it's not a trusted Client, it also needs DPA and TOS fields filled for the User Authorization Screen.

**Note 3:** The App Domain must exist in the Target API Environment

**Note 4:** If the localhost subdomains don't resolve, you might try adding the following to your `/etc/hosts` file.

```
127.0.0.1	app.localhost
127.0.0.1	app-cdn.localhost
127.0.0.1	app.staging.localhost
127.0.0.1	app.prerelease-magenta.localhost
```

#### Choosing a Target API Environment

One can point the App at different environments by using different hostnames:

| API Environment | URL                                       |
| --------------- | ----------------------------------------- |
| **Production**  | https://app.localhost/                    |
| **Staging**     | https://app.staging.localhost/            |
| **Prerelease**  | https://app.prerelease-magenta.localhost/ |


## Overview

### `src/`

* [**`components`**](#components) are *not* connected to the store and only serve presentational purpose
* [**`containers`**](#containers) should connect to the store and render components passing data
* [**`microapps`**](#microapps) are accessible to logged in users and represent a self-contained unit ~~with a menu item and own color theme~~, e.g. `Settings`
* [**`pages`**](#pages) are located directly under the root node and are independent of any other part of the app. ~~they can however be wrapped by containers if they need to be connected to the store~~
* [**`server`**](#server) is responsible for the server-side rendering of the app
* [**`store`**](#store) comprises actions, reducers and the store config
* [**`utils`**](#utils) act like internal libraries and offer functions that are used throughout different parts of the app


## [Redux](http://redux.js.org)

The basic workflow in this app is powered by **redux**, which basically consists of a store, actions and reducers.

### Store

Nothing too fancy, holds the state of the app.

### Actions

To create one or multiple actions use `createActions`. Should be placed in `src/actions`

#### Synchronous actions

```js
const actions = createActions({
  simpleAction (foo, bar) {
    return { payload: { foo, bar } }
  }
  // ...
})
```

When called, this action will be dispatched automatically with the associated type (given by its name):

```js
actions.simpleAction('Hello', 'World')

/*
This is what the dispatched object looks like:
{
  type: 'simpleAction',
  foo: 'Hello',
  bar: 'World'
}
*/
```

#### Asynchronous actions

An async action is recognized by returning a callback instead of an object.

Params given into the callback


| Param      | Type     | Description                                           |
| ---------- | -------- | ----------------------------------------------------- |
| `dispatch` | function | Dispatches actions.                                   |
| `api`      | object   | A function to call the API (provided by the `js-sdk`) |
| `state`    | function | The current application state.                        |


```js
const actions = createActions({
  asyncLogin (user, pass) {
    return async (dispatch, api, state) => {
      dispatch({ status: 'pending' })

      const response = await api({
        path: 'api/some/endpoint',
        params: {
          foo: state.bar
        }
      })
      if (response.status.code === 200) {
        dispatch({ status: 'ok', payload: response.entity })
      } else {
        // Example for an error
        dispatch({ status: 'error', payload: response.error })
      }
    }
  }
})
```

### Reducers

```js
const reducers = createReducers({
  simpleAction (state, action) {
    return {
      ...state,

    }
  },
  asyncLogin (state, action) {
    // action.status one of 'pending', 'ok' or 'error'
  }

})
```

## Developer notes

## Tests

### Linting

```sh
yarn lint
```

### Writing unit tests

Whenever you create or edit a React component or any other JavaScript file, you must update or create a corresponding test file in the same directory.

By convention the test file should be named after the file's name with an additional `.test.` part:

```sh
SomeDir
  | - MyButton.jsx
  | - MyButton.test.jsx
```

```sh
SomeOtherDir
  | - utils.js
  | - utils.test.js
```

To manually trigger the unit tests, run:

```sh
yarn test:unit
```

You can also use the corresponding watch task:

```sh
yarn watch:test:unit
```

The unit tests are performed using the [Jest platform](https://facebook.github.io/jest/), please refer its documentation.

React component testing is based on the [Enzyme testing utility](http://airbnb.io/enzyme/docs/api/), please refer to its documentation.

The use of snapshots generated by the `toMatchSnapshot()` method is strongly encouraged. [Those snapshots must be always commited as they are a very useful tool whenever you want to make sure your UI does not change unexpectedly](https://facebook.github.io/jest/docs/en/snapshot-testing.html)

### e2e

#### wdio setup

This is the default and preferred way of writting / running e2e tests. Whenever you have to refactor or create new specs, please use the new setup!

The exhaustive documentation can be found in the [e2e repository](https://github.com/allthings/e2e).

##### Writting specs

K.I.S.S. principle is the golden rule here 📜.

A spec:
- should not be any longer than 100 loc, if not split it!
- should be purely declarative, easy to read. Do not introduce complex utility functions for the sake of making it cleaver, it should be easy to understand!
- should be testing one piece of functionality, not a complete section (e.g. create / edit / delete).
- should not test the back-end. The back-end has its own set of unit tests.
- should not rely on data you have created or modify in another spec. If you expect something to be there, you probably need the db-data dump to be adjusted to your need.

The specs are living in `./test/wdio/test/app/specs/`.

The specs are using [webdriver i/o](https://webdriver.io/), please refer to its own documentation.

##### Running a spec against your dev environment

You can either use `chrome` or `firefox` directly without any additional setup (more browsers / devices are available, please check the [e2e repository](https://github.com/allthings/e2e)):

```sh
# Run all the specs against chrome and firefox.
yarn wdio
```

```sh
# Run one spec against chrome.
yarn wdio:chrome --spec custom-filter-creation
```

```sh
# Run one spec against firefox.
yarn wdio:firefox --spec custom-filter-creation
```

##### Troubleshoot

Getting `Cannot start service geckodriver` / `Cannot start service chromedriver`?

`cd ./test/wdio && docker-compose down -v`

#### Legacy setup

##### Writing e2e tests

The e2e tests are written with [Nightwatch.js](http://nightwatchjs.org/).
New tests can be simply added by creating new spec files in the `test/e2e/specs`
directory.

In order to wait for an element before performing any kind of interaction (e.g. a click), you should use the following custom command:

```js
browser
  .waitForElementClickable(someElement)
  .click(someElement)
```

Please note that the tests are clustered in four different directories (`test/specs/app/pipeline-1`, `test/specs/app/pipeline-2`, `test/specs/app/pipeline-3`, `test/specs/app/pipeline-4`) in order to get them running concurrently in the CI! They are organized in a way that the average execution time of each folder is almost similar.

##### Running e2e tests

###### Run e2e tests in an isolated docker environment

```sh
yarn e2e
```

###### Debug e2e tests via VNC
Unless `npm run e2e` has been executed already, run the following command once:

```sh
yarn release-build
```

Next you'll be able to debug the e2e tests with the following command:

```sh
yarn e2e-vnc
```

###### Run e2e tests against the development environment

```sh
yarn e2e-dev
```

###### Run e2e tests against the development environment with a local Chrome:

```sh
yarn e2e-local
```

###### Run e2e tests against the staging environment via BrowserStack:

```sh
yarn e2e-browserstack
```

By default, this uses a random BrowserStack environment (usually Firefox on
Windows). To select a specific environment, use the following command:

```sh
yarn e2e-browserstack --env iphone|android|edge|ie|safari|firefox
```

###### Run e2e tests against the development environment via BrowserStack:

```sh
yarn e2e-browserstack-local
```

##### Tags

Run only one or multiple tags:

```sh
yarn e2e --tag login
yarn e2e --tag password login
```

Skipping tag(s) can be performed as follow:

```sh
yarn e2e --skiptags login
yarn e2e --skiptags login,password
```

## Deploying

Deploy to AWS with `yarn deploy ENVIRONMENT`

- `yarn deploy staging` deploys to staging stage
- `yarn deploy prerelease-ENV_NAME` deploys to prerelease stage (replace `ENV_NAME` with the prerelease name: [check wiki](https://allthings.atlassian.net/wiki/spaces/PD/pages/1118208039/Prerelease) for available environments)
- `yarn version` (enter version when prompted) or `npm version [major|minor|patch]` deploys to production

If you are having issues deploying, please check the [Troubleshoot](#troubleshoot) section.

## Testing the legacy bundle in your evergreen browser

Append `force-legacy-bundle` as a query parameter to the URL.

## Troubleshoot

#### Deploying fails with `warning Integrity check: Top level patterns don't match`

Your `node_modules` are out of date. Run `yarn` and try again.

#### Deploying fails with `warning Integrity check: Flags don't match`

This probably means one of our packages was updated to a newer version, and this package has sub-dependencies which were also updated to a newer version. The integrity check fails because the `yarn.lock` file still lists the old versions of the sub-dependencies.

Delete your `yarn.lock`, run `yarn`, and then push your newly created `yarn.lock`.

####  Running `e2e-dev` fails with `nc: bad address 'chromedriver'`
If you receive this after running the command above
> Starting e2e_chromedriver_1
> Waiting for chromedriver:4444 to become available ... timeout
> nc: bad address 'chromedriver'

Execute `yarn e2e-dev --down` and run the tests again

## UI

### Allthings Elements

The UI is based on [Allthings Elements](https://github.com/allthings/elements).

You can find some useful ressources regarding Elements over here:

- [Elements documentation](https://developers.allthings.me/elements/index.html)
- Latest [Elements Storybook](https://allthings-elements.netlify.com) (based on the latest `master` branch)
- [Elements Examples](http://github.com/allthings/elements-example) (some very basic **public** Examples)
- [Elements Playground](https://github.com/allthings/elements-playground) (some **internally** used Examples)

### Colors

We're using the [Allthings Color Palette](https://allthings.github.io/colors) for every colorization within the App. You can find the repo [over here](https://github.com/allthings/colors)
