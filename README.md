# Book a secure move frontend

This is the rendering application for the Book a secure move service.

Book a secure move is part of the HMPPS Prisoner Escort and Custody
Service (PECS) programme.

## Dependencies

- [Node.js](https://nodejs.org/en/) (>= 11.14.0)
- [NPM](https://www.npmjs.com/) (>= 6.7.0)
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

#### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

#### In development mode

Ensure Redis is installed and running.

```
npm run develop
```

The app will be running at [http://localhost:3000](http://localhost:3000) or with browsersync at [http://localhost:3001](http://localhost:3001).

## Testing and linting

### Unit tests

Unit tests are run using the [Mocha](https://mochajs.org/) test framework and the [Chai](https://www.chaijs.com/) library for assertions.

It also includes the [Sinon](https://sinonjs.org/) library for test spies, stubs and mocks.

To check unit tests results run:

```
npm run test
```

### Code coverage

Code coverage is provided by Istanbul's command line tool, [nyc](https://www.npmjs.com/package/nyc).

To see coverage reports run:

```
npm run coverage
```

### Linting

[ESLint](https://eslint.org/) is used to lint JavaScript code and keep a consistent standard in the way it is written within this project.

The config uses the [StandardJS](https://standardjs.com/) style as a base with [some custom tweaks](./.eslintrc.js).

To check linting results run:

```
npm run lint
```

## Environment variables

| Name | Description | Default |
|:-----|:------------|:--------|
| PORT | Port the web server listens on | `3000` |
| LOG_LEVEL | Level of logs to output | production: `error`, development: `debug` |
| ASSETS_HOST | Host for assets CDN | |
| SESSION_SECRET **(required)** | A complex string unique to the environment, used to encrypt cookies | |
| SESSION_NAME | Name of the session ID cookie to set in the response (and read from in the request) | `book-secure-move.sid` |
| SESSION_TTL | How long the user session should last (in milliseconds) | `1800000` (30 minutes) |
| SESSION_DB_INDEX | Redis database index in which to store session data | `0` (Redis' default)|
| REDIS_URL **(required)** | Redis server URL, including port | |
| API_BASE_URL **(required)** | Base URL for the backend API server for this service | |
| API_AUTH_URL **(required)** | URL to which OAuth2 access token requests should be sent | |
| API_CLIENT_ID **(required)** | Client ID used to authenticate with the backend API | |
| API_SECRET **(required)** | Client secret used to authenticate with the backend API | |
| AUTH_PROVIDER_KEY **(required)** | Client key provided by the OAuth2 provider for user authentication | |
| AUTH_PROVIDER_SECRET **(required)** | Client secret provided by the OAuth2 provider for user authentication | |
| AUTH_PROVIDER_URL **(required)** | Base URL for the auth provider server | |
| SERVER_HOST **(required)** | The (accessible) hostname (and port) of the listening web server. Used by [Grant](https://github.com/simov/grant) to construct redirect URLs after OAuth authentication. For example `localhost:3000` | |
| FEEDBACK_URL | URL for the feedback link in the phase banner at the top of the page. If empty, the link will not be displayed. | |

## Components

See the [components readme](./common/components/README.md) for more detail on how to structure app level components.
