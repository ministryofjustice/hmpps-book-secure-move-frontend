# Testing

## Unit tests

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

## Acceptance tests

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

Tests can be paused before each test run using the `--debug-mode` option, and paused on failures with the `--debug-on-fail` option

Screenshots are taken whenever a test fails.

Videos are taken when a test fails if enabled (see the `--video` option).

Video and screenshots are stored in `artifacts` directory.

## Code coverage

Code coverage is provided by Istanbul's command line tool, [nyc](https://www.npmjs.com/package/nyc).

To see coverage reports run:

```bash
npm run coverage
```

To open the results in a browser after running use:

```bash
npm run coverage:open
```
