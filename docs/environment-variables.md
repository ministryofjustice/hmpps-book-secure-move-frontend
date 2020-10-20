# Environment variables

## General

- Environment variables can be set for local development using a `.env` file. An example file is included as a starting point.
- The TZ (timezone) environment variable is set to 'Europe/London' in `start.js`.

| Name                                | Description                                                                                                                                                                                                                        | Default                                                                             |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| PORT                                | Port the web server listens on                                                                                                                                                                                                     | `3000`                                                                              |
| SESSION_SECRET **(required)**       | A complex string unique to the environment, used to encrypt cookies                                                                                                                                                                |                                                                                     |
| SESSION_NAME                        | Name of the session ID cookie to set in the response (and read from in the request)                                                                                                                                                | `book-secure-move.sid`                                                              |
| SESSION_TTL                         | How long the user session should last (in milliseconds)                                                                                                                                                                            | `1800000` (30 minutes)                                                              |
| SESSION_DB_INDEX                    | Redis database index in which to store session data                                                                                                                                                                                | `0` (Redis' default)                                                                |
| REDIS_URL                           | Redis server URL, including port and protocol. If not provided, in-memory cache used instead                                                                                                                                       |                                                                                     |
| REDIS_HOST                          | Redis hostname. Can be used instead of `REDIS_URL`. Will override `REDIS_URL` if set                                                                                                                                               |                                                                                     |
| REDIS_AUTH_TOKEN                    | Optional auth token for the Redis instance                                                                                                                                                                                         |                                                                                     |
| API_BASE_URL **(required)**         | Base URL for the backend API server for this service without any path                                                                                                                                                              |                                                                                     |
| API_PATH **(required)**             | Base path for the API                                                                                                                                                                                                              |                                                                                     |
| API_TIMEOUT                         | API request timeout (ms)                                                                                                                                                                                                           | 30000                                                                               |
| API_HEALTHCHECK_PATH **(required)** | Path to which healthcheck pings are sent                                                                                                                                                                                           |                                                                                     |
| API_CLIENT_ID **(required)**        | Client ID used to authenticate with the backend API                                                                                                                                                                                |                                                                                     |
| API_SECRET **(required)**           | Client secret used to authenticate with the backend API                                                                                                                                                                            |                                                                                     |
| API_VERSION **(required)**          | API version to use                                                                                                                                                                                                                 |                                                                                     |
| API_CACHE_EXPIRY                    | The expiry time of cached API request (in seconds)                                                                                                                                                                                 | 7 days                                                                              |
| API_AUTH_PATH **(required)**        | Path to which OAuth2 access token requests should be sent                                                                                                                                                                          |                                                                                     |
| API_AUTH_TIMEOUT                    | API authentication token request timeout (ms)                                                                                                                                                                                      | 10000                                                                               |
| AUTH_PROVIDER_URL **(required)**    | Base URL for the auth provider server                                                                                                                                                                                              |                                                                                     |
| AUTH_PROVIDER_KEY **(required)**    | Client key provided by the OAuth2 provider for user authentication                                                                                                                                                                 |                                                                                     |
| AUTH_PROVIDER_SECRET **(required)** | Client secret provided by the OAuth2 provider for user authentication                                                                                                                                                              |                                                                                     |
| AUTH_EXPIRY_MARGIN                  | How close the user authentication should be to expiring before refreshing it                                                                                                                                                       | `300` (5 minutes)                                                                   |
| NOMIS_ELITE2_API_URL **(required)** | Base URL for the NOMIS Elite 2 API, without trailing slash                                                                                                                                                                         |                                                                                     |
| NOMIS_ELITE2_API_HEALTHCHECK_PATH   | Path to which healthcheck pings for NOMIS Elite 2 API are sent                                                                                                                                                                     | /health/ping                                                                        |
| SERVER_HOST **(required)**          | The (accessible) hostname (and port) of the listening web server. Used by [Grant](https://github.com/simov/grant) to construct redirect URLs after OAuth authentication. For example `localhost:3000`                              |                                                                                     |
| ASSETS_HOST                         | Host for assets CDN                                                                                                                                                                                                                |                                                                                     |
| FEEDBACK_URL                        | URL for the feedback link in the phase banner at the top of the page. If empty, the link will not be displayed.                                                                                                                    |                                                                                     |
| PERSON_ESCORT_RECORD_FEEDBACK_URL   | URL for the feedback prompt to collect Person Escort Record feedback. If empty, the link will not be displayed. | |
| SUPPORT_EMAIL                       | Email address used to contact support or the team in parts of the app where the user may require further help.                                                                                                                     |                                                                                     |
| LOCATIONS_BATCH_SIZE                | Maximum number of location IDs to send in one request when requesting moves for all locations                                                                                                                                      | 40                                                                                  |
| FRAMEWORKS_VERSION                  | Current [Book a secure move frameworks](https://github.com/ministryofjustice/hmpps-book-secure-move-frameworks/releases) version that the frontend will use to create new Person Escort Records or any other frameworks being used | latest supported version (see `@hmpps-book-secure-move-frameworks` in package.json) |
| LOG_LEVEL                           | Level of logs to output                                                                                                                                                                                                            | production: `error`, development: `debug`                                           |

## Metrics and Anallytics
| Name                                | Description                                                                                                                                                                                                                        | Default                                                                             |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| SENTRY_DSN                          | Sentry DSN used to log issues in sentry                                                                                                                                                                                            |                                                                                     |
| SENTRY_ORG                          | Sentry organisation slug                                                                                                                                                                                                           |                                                                                     |
| SENTRY_PROJECT                      | Sentry project slug                                                                                                                                                                                                                |                                                                                     |
| SENTRY_ENVIRONMENT                  | Environment used to distinguish issue location                                                                                                                                                                                     |                                                                                     |
| SENTRY_AUTH_TOKEN                   | Sentry internal integration token used to publish release                                                                                                                                                                          |                                                                                     |
| PROMETHEUS_MOUNTPATH | Mountpath to serve Prometheus metrics. If none, no metrics will be collected | |
| GOOGLE_ANALYTICS_ID                 | Google analytics tracking ID to use for the environment                                                                                                                                                                            |                                                                                     |

## E2E Tests

| Name                                | Description                                                                                                                                                                                                                        | Default                                                                             |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| E2E_BASE_URL | Base URL used for acceptance testing | `http://${process.env.SERVER_HOST}` |
| E2E_MAX_PROCESSES | Max number of processes to use for end-to-end tests | 1 |
| E2E_FAIL_FAST | Whether to stop all tests if an end-to-end tests fails | false |
| E2E_VIDEO | Whether to capture video when end-to-end tests fail | false |
| E2E_SKIP | Comma-delimited list of files to skip when running the end-to-end tests eg. test/e2/allocation.cancel.test.js | |
| E2E_MOCK_AUTH | Whether to use the mock auth server | false |

## E2E Users

| Name                                | Description                                                                                                                                                                                                                        | Default                                                                             |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| E2E_COURT_USERNAME | Court user username used for acceptance testing | |
| E2E_COURT_PASSWORD | Court user password used for acceptance testing | |
| E2E_OCA_USERNAME | OCA user username used for acceptance testing | |
| E2E_OCA_PASSWORD | OCA user password used for acceptance testing | |
| E2E_PER_USERNAME | Person Escort Record user username used for acceptance testing | |
| E2E_PER_PASSWORD | Person Escort Record user password used for acceptance testing | |
| E2E_PMU_USERNAME | Population Management Unit user username used for acceptance testing | |
| E2E_PMU_PASSWORD | Population Management Unit user password used for acceptance testing | |
| E2E_POLICE_USERNAME | Police user username used for acceptance testing | |
| E2E_POLICE_PASSWORD | Police user password used for acceptance testing | |
| E2E_PRISON_USERNAME | Prison user username used for acceptance testing | |
| E2E_PRISON_PASSWORD | Prison user password used for acceptance testing | |
| E2E_SCH_USERNAME | Secure Children Homr user username used for acceptance testing | |
| E2E_SCH_PASSWORD | Secure Children Home user password used for acceptance testing | |
| E2E_STC_USERNAME | Secure Training user username used for acceptance testing | |
| E2E_STC_PASSWORD | Secure Training user password used for acceptance testing | |
| E2E_SUPPLIER_USERNAME | Supplier user username used for acceptance testing | |
| E2E_SUPPLIER_PASSWORD | Supplier user username used for acceptance testing | |

## Feature Flags

| Name             | Description                                                                  | Default |
| :--------------- | :--------------------------------------------------------------------------- | :------ |
| FEATURE_FLAG_PERSON_ESCORT_RECORD   | Set to `true` to enable display of the Person Escort Record feature                                                                                                                                                                |                                                                                     |

## Development specific

The following environment variables can be set to help development.

| Name             | Description                                                                  | Default |
| :--------------- | :--------------------------------------------------------------------------- | :------ |
| BYPASS_SSO       | Set to `true` to bypass authentication                                       |         |
| USER_PERMISSIONS | Comma delimited string of available permissions (required if bypassing auth) |         |
| USER_LOCATIONS   | Comma delimited string of available locations (required if bypassing auth)   |         |
