// Core dependencies
const path = require('path')

// NPM dependencies
const Sentry = require('@sentry/node')
const compression = require('compression')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const express = require('express')
const session = require('express-session')
const grant = require('grant-express')
const helmet = require('helmet')
const i18nMiddleware = require('i18next-express-middleware')
const morgan = require('morgan')
const responseTime = require('response-time')
const favicon = require('serve-favicon')
const slashify = require('slashify')

// Local dependencies
const healthcheckApp = require('./app/healthcheck')
const locationsApp = require('./app/locations')
const router = require('./app/router')
const metrics = require('./common/lib/metrics')
const checkSession = require('./common/middleware/check-session')
const ensureAuthenticated = require('./common/middleware/ensure-authenticated')
const ensureSelectedLocation = require('./common/middleware/ensure-selected-location')
const errorHandlers = require('./common/middleware/errors')
const locals = require('./common/middleware/locals')
const { setCanAccess } = require('./common/middleware/permissions')
const processOriginalRequestBody = require('./common/middleware/process-original-request-body')
const sentryEnrichScope = require('./common/middleware/sentry-enrich-scope')
const sentryRequestId = require('./common/middleware/sentry-request-id')
const setLocations = require('./common/middleware/set-locations')
const setPrimaryNavigation = require('./common/middleware/set-primary-navigation')
const setServices = require('./common/middleware/set-services')
const setTransactionId = require('./common/middleware/set-transaction-id')
const setUser = require('./common/middleware/set-user')
const config = require('./config')
const i18n = require('./config/i18n')
const nunjucks = require('./config/nunjucks')
const { getAssetPath } = require('./config/nunjucks/globals')
const configPaths = require('./config/paths')

let redisStore

if (config.REDIS.SESSION) {
  redisStore = require('./config/redis-store')()
}

// Global constants
const app = express()

if (config.IS_PRODUCTION) {
  app.enable('trust proxy')
}

// Ensure we have a useful transaction id
app.use(setTransactionId)

if (config.SENTRY.DSN) {
  Sentry.init({
    dsn: config.SENTRY.DSN,
    environment: config.SENTRY.ENVIRONMENT,
    release: config.SENTRY.RELEASE,
  })

  app.use(
    Sentry.Handlers.requestHandler({
      // Ensure we don't include `data` to avoid sending any PPI
      request: ['cookies', 'headers', 'method', 'query_string', 'url'],
      user: ['id', 'username', 'permissions'],
    })
  )
  app.use(sentryRequestId)
}

// Configure prometheus to handle metrics
metrics.init(app, config)

app.use(slashify())

// Load the healthcheck app manually before anything
// else to ensure it will return some kind of response
// regardless of the app failing elsewhere
app.use(healthcheckApp.mountpath, healthcheckApp.router)

// view engine setup
app.set('view engine', 'njk')
nunjucks(app, config, configPaths)

// Static files
app.use(compression())
app.use(
  favicon(path.join(configPaths.build, getAssetPath('images/favicon.ico')))
)
app.use(express.static(configPaths.build))
app.use(
  '/assets',
  express.static(
    path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')
  ),
  express.static(
    path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets')
  )
)

// ensure i18n is loaded early as needed for error template
app.use(i18nMiddleware.handle(i18n))

const loggingFormat = config.IS_PRODUCTION ? 'combined' : 'dev'
app.use(morgan(loggingFormat))

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())
app.use(responseTime())
app.use(
  session({
    store: redisStore,
    secret: config.SESSION.SECRET,
    name: config.SESSION.NAME,
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      secure: config.IS_PRODUCTION,
      maxAge: config.SESSION.TTL,
      httpOnly: true,
    },
  })
)
app.use(checkSession)
app.use(setUser)
app.use(sentryEnrichScope)
app.use(flash())
app.use(locals)
app.use(
  grant({
    defaults: {
      origin:
        (config.IS_PRODUCTION ? 'https' : 'http') + `://${config.SERVER_HOST}`,
      callback: '/auth/callback',
      transport: 'session',
      state: true,
    },
    ...config.AUTH_PROVIDERS,
  })
)

// Development environment helpers
if (config.IS_DEV) {
  require('axios-debug-log')
  const development = require('./common/middleware/development')
  app.use(development.bypassAuth(config.AUTH_BYPASS_SSO))
  app.use(development.setUserPermissions(config.USER_PERMISSIONS))
  app.use(development.setUserLocations(config.USER_LOCATIONS))
}

app.use(
  ensureAuthenticated({
    provider: config.DEFAULT_AUTH_PROVIDER,
    whitelist: config.AUTH_WHITELIST_URLS,
    expiryMargin: config.AUTH_EXPIRY_MARGIN,
  })
)
app.use(
  ensureSelectedLocation({
    locationsMountpath: locationsApp.mountpath,
    whitelist: config.AUTH_WHITELIST_URLS,
  })
)
app.use(setLocations)

// unsafe-inline is required as govuk-template injects `js-enabled` class via inline script
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'cdnjs.cloudflare.com',
          'www.googletagmanager.com',
          'www.google-analytics.com',
        ],
        imgSrc: ["'self'", 'www.google-analytics.com'],
        fontSrc: ["'self'", 'fonts.googleapis.com'],
      },
    },
  })
)

// Ensure body processed after reauthentication
app.use(processOriginalRequestBody())

// Set services
app.use(setServices)

// Add permission checker
app.use(setCanAccess)

// Routing
app.use(setPrimaryNavigation)
app.use(router)

// error handling
app.use(Sentry.Handlers.errorHandler())
app.use(errorHandlers.notFound)
app.use(errorHandlers.catchAll(config.IS_DEV))

module.exports = app
