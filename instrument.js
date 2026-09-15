// This file must be required before any other module (particularly `express`
// and `http`) so that Sentry can auto-instrument them. See:
// https://docs.sentry.io/platforms/node/#configure
const Sentry = require('@sentry/node')

const config = require('./config')

if (config.SENTRY.DSN) {
  Sentry.init({
    debug: config.SENTRY.DEBUG,
    dsn: config.SENTRY.DSN,
    environment: config.SENTRY.ENVIRONMENT,
    release: config.SENTRY.RELEASE,
    // HTTP and Express.js middleware tracing are auto-instrumented
    // 10% of all requests will be used for performance sampling
    tracesSampler: ({ name: transactionName }) => {
      if (
        (transactionName && transactionName.includes('ping')) ||
        transactionName.includes('/healthcheck')
      ) {
        return 0
      } else {
        return 0.01
      }
    },
  })
}
