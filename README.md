# Prisoner Escort and Custody Service (PECS) Frontend

This is the rendering application for the PECS service.

## Dependencies

- [Node.js](https://nodejs.org/en/) (>= 11.14.0)
- [NPM](https://www.npmjs.com/) (>= 6.7.0)
- [Redis](https://redis.io/) (>= 5.0.5)

## Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/pecs-frontend && cd pecs-frontend
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

Set the environment variables accordingly.

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

| Name | Description |
|:-----|:------------|
| API_BASE_URL | The base URL for the backend API server for this service |
| API_AUTH_URL | The URL to which OAuth2 access token requests should be sent via a POST request |
| API_KEY | The client key used to authenticate with the backend API |
| API_SECRET | The client secret used to authenticate with the backend API |
| SERVER_HOST | The (accessible) hostname (and port) of the listening web server, e.g. `localhost:3000`. Used by Grant to construct re-direct URLs after OAuth authentication |
| SESSION_SECRET | A complex string unique to the environment, used to encrypt cookies |
| AUTH_PROVIDER_KEY | The client key provided by the OAuth2 provider for user authentication |
| AUTH_PROVIDER_SECRET | The client secret provided by the OAuth2 provider for user authentication |
| AUTH_PROVIDER_URL | The base URL for the HMPPS SSO server |
| REDIS_HOST | The hostname or IP address the Redis server is listening on |
| REDIS_PORT | The port number the Redis server is listening on (e.g. 6379) |
| REDIS_SESSION_DB | The Redis database index in which to store session data (e.g. 0) |

## Components

See the [components readme](./common/components/README.md) for more detail on how to structure app level components.
