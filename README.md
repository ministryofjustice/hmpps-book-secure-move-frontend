# Prisoner Escort and Custody Service (PECS) Frontend

This is the rendering application for the PECS service.

## Dependencies

- [Node.js](https://nodejs.org/en/) (>= 11.14.0)
- [NPM](https://www.npmjs.com/) (>= 6.7.0)

## Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/pecs-frontend && cd pecs-frontend
   ```

1. Install node dependencies:

   ```
   npm install
   ```

1. Create a copy of the example environment variable file and add values for the keys:

   ```
   cp .env.example .env
   ```

1. Build the assets

    ```
    npm run build
    ```

## Running the application

#### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

#### In development mode

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
