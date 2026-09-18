// This file must be required before any other module (particularly `express`
// and `http`) so that Sentry and Application Insights can auto-instrument
// them - both patch modules via OpenTelemetry-style require hooks that only
// affect modules required after this point. See:
// https://docs.sentry.io/platforms/node/#configure
const Sentry = require('@sentry/node')

const { initialiseAppInsights } = require('./common/lib/azure-appinsights')
const config = require('./config')

initialiseAppInsights()

if (config.SENTRY.DSN) {
  Sentry.init({
    debug: config.SENTRY.DEBUG,
    dsn: config.SENTRY.DSN,
    environment: config.SENTRY.ENVIRONMENT,
    release: config.SENTRY.RELEASE,
    // Sentry and Application Insights both auto-instrument via OpenTelemetry and share one
    // tracer provider in this process. Left at Sentry's defaults, its own Http/Express
    // integrations independently patch the same http module and create their own spans
    // alongside ours - verified this produces ~7 spans per request instead of 1 (duplicate
    // server spans, plus Sentry's internal Express middleware spans), none of which pass
    // through our ignoreIncomingRequestHook/healthcheck filtering. Dropping Http/Express here
    // keeps Sentry's error capture (OnUncaughtException/OnUnhandledRejection etc.) and any
    // other auto-instrumentation, while making Application Insights the single source of HTTP
    // tracing data - Sentry's own Performance tab will no longer show HTTP/Express
    // transactions for this app as a result.
    integrations: defaultIntegrations => defaultIntegrations.filter(integration => !['Http', 'Express'].includes(integration.name)),
    // Applies to whatever performance instrumentation remains after the integrations filter
    // above (HTTP/Express tracing itself now lives in Application Insights, not here)
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
