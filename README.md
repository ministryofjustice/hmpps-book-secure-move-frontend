# Book a secure move frontend

[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-book-secure-move-frontend.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-book-secure-move-frontend)
[![Coverage Status](https://coveralls.io/repos/github/ministryofjustice/hmpps-book-secure-move-frontend/badge.svg)](https://coveralls.io/github/ministryofjustice/hmpps-book-secure-move-frontend)
[![Test Coverage](https://api.codeclimate.com/v1/badges/93a7ea86058dc9d2f2dc/test_coverage)](https://codeclimate.com/github/ministryofjustice/hmpps-book-secure-move-frontend/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/93a7ea86058dc9d2f2dc/maintainability)](https://codeclimate.com/github/ministryofjustice/hmpps-book-secure-move-frontend/maintainability)

This is the rendering application for the Book a secure move service.

Book a secure move is part of the HMPPS Prisoner Escort and Custody
Service (PECS) programme.

## Dependencies

- [Node.js](https://nodejs.org/en/) (>= 14)
- [NPM](https://www.npmjs.com/) (>= 6.14)
- [Redis](https://redis.io/) (>= 5.0.5)

## Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/hmpps-book-secure-move-frontend && cd hmpps-book-secure-move-frontend
   ```

1. Install node dependencies:

   ```
   npm install
   ```

1. Build the assets

    ```
    npm run build
    ```

## Configuring the application

Create a copy of the example environment variable file and add values for the keys:

   ```
   cp .env.example .env
   ```

Set the [environment variables](#environment-variables) accordingly.

## Running the application

### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

### In development mode

Ensure Redis is installed and running.

```
npm run develop
```

The app will be running at [http://localhost:3000](http://localhost:3000) or with browsersync at [http://localhost:3001](http://localhost:3001).

#### Running with debugging

Some extra levels of debugging have been added to aid development.

To see all axios requests/responses run:

```
DEBUG=axios npm run develop
```

To see app level debug logs run:

```
DEBUG=app:* npm run develop
```

You can combine namespaces, for example:

```
DEBUG=axios,app:* npm run develop
```

## Testing and linting

### Unit tests

Unit tests are run using the [Mocha](https://mochajs.org/) test framework and the [Chai](https://www.chaijs.com/) library for assertions.

It also includes the [Sinon](https://sinonjs.org/) library for test spies, stubs and mocks.

To check unit tests results:

```
npm test
```

To watch unit tests whilst developing:

```
npm run watch:test
```

### Acceptance tests

Acceptance (end-to-end) tests run using [TestCafe](https://devexpress.github.io/testcafe/) framework
and configured in CircleCI to run against `$E2E_BASE_URL` variable (staging) when the app is merged to
`master` and deployed to staging.

To run the CI tests locally run:

```
npm run test-e2e:ci
```

To debug tests on local server run:

```
npm run test-e2e:local
```

To debug tests on local server against the API running locally, run:

```
npm run test-e2e:local:api
```

Further options can be passed to all these commands.

Available options can be seen by running the command with the `-h` (help) option.

```
npm run test-e2e:ci -- -h
npm run test-e2e:local -- -h
```

Screenshots are taken whenever a test fails.

Videos are taken when a test fails if enabled (see the `--video` option).

Video and screenshots are stored in `artifacts` directory.

### Code coverage

Code coverage is provided by Istanbul's command line tool, [nyc](https://www.npmjs.com/package/nyc).

To see coverage reports run:

```bash
npm run coverage
```

To open the results in a browser after running use:

```bash
npm run coverage:open
```

### Linting

#### JavaScript

[ESLint](https://eslint.org/) is used to lint JavaScript code and keep a consistent standard in the way it is written within this project.

The config uses the [StandardJS](https://standardjs.com/) style as a base with [some custom tweaks](./.eslintrc.js).

[Prettifier](https://prettier.io) is also used to extend eslint to add some extra rules
around how files are formatted. It can be [integrated to many popular editors](https://prettier.io/docs/en/editors.html)
to help with formatting on save.

To check linting results run:

```bash
npm run lint
```

#### Commit messages

[Commitlint](https://commitlint.js.org/) is used to lint commit messages to ensure they conform to [conventional convention](https://commitlint.js.org/#/concepts-commit-conventions).

This convention is required to automate the generation of changelogs and release notes on GitHub during the [release process](#releases-and-deployment).

## Releases and deployment

Releases and changelogs are automatically generated using [standard-version](https://www.npmjs.com/package/standard-version). To generate a new release run:

```bash
npm run release
```

This will:

- update contributors in `package.json`
- increase the version in `package.json` based on commits since last tag
- create a new changelog entry
- create a version commit
- create a new git tag
- push commit and tags to remote

It will also start a new deployment specific [job on CircleCI](https://app.circleci.com/github/ministryofjustice/hmpps-book-secure-move-frontend/pipelines) which will run the full suite of automated tests and create a [release on GitHub](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/releases).

**Note:** The deployment job has a [manual approval](https://circleci.com/blog/supporting-digital-transformation-while-avoiding-common-stalls/) step before it will release that version to production.

## Environment variables

The TZ (timezone) environment variable is set to 'Europe/London' in `start.js`.

| Name | Description | Default |
|:-----|:------------|:--------|
| PORT | Port the web server listens on | `3000` |
| LOG_LEVEL | Level of logs to output | production: `error`, development: `debug` |
| ASSETS_HOST | Host for assets CDN | |
| SESSION_SECRET **(required)** | A complex string unique to the environment, used to encrypt cookies | |
| SESSION_NAME | Name of the session ID cookie to set in the response (and read from in the request) | `book-secure-move.sid` |
| SESSION_TTL | How long the user session should last (in milliseconds) | `1800000` (30 minutes) |
| SESSION_DB_INDEX | Redis database index in which to store session data | `0` (Redis' default)|
| REDIS_URL | Redis server URL, including port and protocol. If not provided, in-memory cache used instead | |
| REDIS_HOST | Redis hostname. Can be used instead of `REDIS_URL`. Will override `REDIS_URL` if set | |
| REDIS_AUTH_TOKEN | Optional auth token for the Redis instance | |
| API_BASE_URL **(required)** | Base URL for the backend API server for this service without any path | |
| API_PATH **(required)** | Base path for the API | |
| API_TIMEOUT | API request timeout (ms) | 30000 |
| API_AUTH_TIMEOUT | API authentication token request timeout (ms) | 10000 |
| API_VERSION **(required)** | API version to use | |
| API_HEALTHCHECK_PATH **(required)** | Path to which healthcheck pings are sent | |
| API_AUTH_PATH **(required)** | Path to which OAuth2 access token requests should be sent | |
| API_CLIENT_ID **(required)** | Client ID used to authenticate with the backend API | |
| API_SECRET **(required)** | Client secret used to authenticate with the backend API | |
| API_CACHE_EXPIRY | The expiry time of cached API request (in seconds) | 7 days |
| AUTH_PROVIDER_KEY **(required)** | Client key provided by the OAuth2 provider for user authentication | |
| AUTH_PROVIDER_SECRET **(required)** | Client secret provided by the OAuth2 provider for user authentication | |
| AUTH_PROVIDER_URL **(required)** | Base URL for the auth provider server | |
| AUTH_EXPIRY_MARGIN | How close the user authentication should be to expiring before refreshing it | `300` (5 minutes) |
| NOMIS_ELITE2_API_URL **(required)** | Base URL for the NOMIS Elite 2 API, without trailing slash | |
| NOMIS_ELITE2_API_HEALTHCHECK_PATH | Path to which healthcheck pings for NOMIS Elite 2 API are sent | /health/ping |
| SERVER_HOST **(required)** | The (accessible) hostname (and port) of the listening web server. Used by [Grant](https://github.com/simov/grant) to construct redirect URLs after OAuth authentication. For example `localhost:3000` | |
| FEEDBACK_URL | URL for the feedback link in the phase banner at the top of the page. If empty, the link will not be displayed. | |
| PERSON_ESCORT_RECORD_FEEDBACK_URL | URL for the feedback prompt to collect Person Escort Record feedback. If empty, the link will not be displayed. | |
| SUPPORT_EMAIL | Email address used to contact support or the team in parts of the app where the user may require further help. | |
| SENTRY_DSN | Sentry DSN used to log issues in sentry | |
| SENTRY_ORG | Sentry organisation slug | |
| SENTRY_PROJECT | Sentry project slug | |
| SENTRY_ENVIRONMENT | Environment used to distinguish issue location | |
| SENTRY_AUTH_TOKEN | Sentry internal integration token used to publish release | |
| GOOGLE_ANALYTICS_ID | Google analytics tracking ID to use for the environment | |
| E2E_BASE_URL | Base URL used for acceptance testing | `http://${process.env.SERVER_HOST}` |
| E2E_MAX_PROCESSES | Max number of processes to use for end-to-end tests | 1 |
| E2E_FAIL_FAST | Whether to stop all tests if an end-to-end tests fails | false |
| E2E_VIDEO | Whether to capture video when end-to-end tests fail | false |
| E2E_SKIP | Comma-delimited list of files to skip when running the end-to-end tests eg. test/e2/allocation.cancel.test.js | |
| E2E_MOCK_AUTH | Whether to use the mock auth server | false |
| E2E_POLICE_USERNAME | Police user username used for acceptance testing | |
| E2E_POLICE_PASSWORD | Police user password used for acceptance testing | |
| E2E_SUPPLIER_USERNAME | Supplier user username used for acceptance testing | |
| E2E_SUPPLIER_PASSWORD | Supplier user password used for acceptance testing | |
| LOCATIONS_BATCH_SIZE | Maximum number of location IDs to send in one request when requesting moves for all locations | 40 |
| FEATURE_FLAG_PERSON_ESCORT_RECORD | Set to `true` to enable display of the Person Escort Record feature | |
| FRAMEWORKS_VERSION | Current [Book a secure move frameworks](https://github.com/ministryofjustice/hmpps-book-secure-move-frameworks/releases) version that the frontend will use to create new Person Escort Records or any other frameworks being used | latest supported version (see `@hmpps-book-secure-move-frameworks` in package.json) |

### Development specific

The following environment variables can be set to help development.

| Name | Description | Default |
|:-----|:------------|:--------|
| BYPASS_SSO | Set to `true` to bypass authentication | |
| USER_PERMISSIONS | Comma delimited string of available permissions (required if bypassing auth) | |
| USER_LOCATIONS | Comma delimited string of available locations (required if bypassing auth) | |

## Components

See the [components readme](./common/components/README.md) for more detail on how to structure app level components.

## Book a secure move frameworks

The frontend uses the [Book a secure move frameworks](https://github.com/ministryofjustice/hmpps-book-secure-move-frameworks) repo to build and maintain
certain features like the Person Escort Record.

The frontend maintains a list of versions of the framework that are supported in the package.json manifest under a scope of `@hmpps-book-secure-move-frameworks`. Each version is then maintained as a folder underneath that scope, for example `@hmpps-book-secure-move-frameworks/0.1.0`.

The frontend needs to maintain separate versions so that it can render any previous records created using the framework or allow users to continue
to edit existing records that have been created using specific versions.

### To support a new version

- Add a new item under the framework scope to the package manifest:

  ```
  "@hmpps-book-secure-move-frameworks/{semanticVersion}": "github:ministryofjustice/hmpps-book-secure-move-frameworks#v{semanticVersion}"
  ```

### To override the current version

The current version is used when creating new framework resources. It can be overridden using an environment variable (`FRAMEWORKS_VERSION`),
for example when adding support for a new version but we want to still create records using an older version.
