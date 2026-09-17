// Core dependencies
const crypto = require('crypto')
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
const i18nMiddleware = require('i18next-http-middleware')
const morgan = require('morgan')
const responseTime = require('response-time')
const favicon = require('serve-favicon')

// Local dependencies
const healthcheckApp = require('./app/healthcheck')
const locationsApp = require('./app/locations')
const router = require('./app/router')
const metrics = require('./common/lib/metrics')
const breadcrumbs = require('./common/middleware/breadcrumbs')
const checkSession = require('./common/middleware/check-session')
const ensureAuthenticated = require('./common/middleware/ensure-authenticated')
const ensureSelectedLocation = require('./common/middleware/ensure-selected-location')
const errorHandlers = require('./common/middleware/errors')
const locals = require('./common/middleware/locals')
const { setCanAccess } = require('./common/middleware/permissions')
const processOriginalRequestBody = require('./common/middleware/process-original-request-body')
const sentryEnrichScope = require('./common/middleware/sentry-enrich-scope')
const sentryRequestId = require('./common/middleware/sentry-request-id')
const setApiClient = require('./common/middleware/set-api-client')
const setCacheControl = require('./common/middleware/set-cache-control')
const setDevelopmentTools = require('./common/middleware/set-development-tools')
const setLocation = require('./common/middleware/set-location')
const setLocations = require('./common/middleware/set-locations')
const setPrimaryNavigation = require('./common/middleware/set-primary-navigation')
const setServices = require('./common/middleware/set-services')
const setTransactionId = require('./common/middleware/set-transaction-id')
const setUser = require('./common/middleware/set-user')
const config = require('./config')
const i18n = require('./config/i18n').default
const nunjucks = require('./config/nunjucks')
const { getAssetPath } = require('./config/nunjucks/globals')
const configPaths = require('./config/paths')

module.exports = async () => {
  let redisStore

  if (config.REDIS.SESSION) {
    redisStore = await require('./config/redis-store')()
  }

  // Global constants
  const app = express()

  if (config.IS_PRODUCTION) {
    app.enable('trust proxy')
  }

  // Ensure we have a useful transaction id
  app.use(setTransactionId)

  // Sentry.init() runs in ./instrument.js, required before this module so
  // that auto-instrumentation of express/http can be set up in time
  if (config.SENTRY.DSN) {
    app.use(sentryRequestId)
  }

  // Configure prometheus to handle metrics
  metrics.init(app, config)

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
  app.use(
    express.static(configPaths.build, {
      maxAge: config.STATIC_ASSETS.CACHE_MAX_AGE,
    })
  )
  app.use(
    '/assets',
    express.static(
      path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/assets'),
      { maxAge: config.STATIC_ASSETS.CACHE_MAX_AGE }
    ),
    express.static(
      path.join(
        __dirname,
        '/node_modules/@ministryofjustice/frontend/moj/components'
      ),
      { maxAge: config.STATIC_ASSETS.CACHE_MAX_AGE }
    ),
    express.static(
      path.join(
        __dirname,
        '/node_modules/@ministryofjustice/frontend/moj/assets'
      ),
      { maxAge: config.STATIC_ASSETS.CACHE_MAX_AGE }
    ),
    express.static(
      path.join(__dirname, '/node_modules/hmrc-frontend/hmrc/all'),
      {
        maxAge: config.STATIC_ASSETS.CACHE_MAX_AGE,
      }
    )
  )

  // Cache control headers should be set after static assets but
  // before other requests
  app.use(setCacheControl)

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
  app.use(breadcrumbs.init())
  app.use(locals)
  app.use(
    grant({
      defaults: {
        origin:
          (config.IS_PRODUCTION ? 'https' : 'http') +
          `://${config.SERVER_HOST}`,
        callback: '/auth/callback',
        transport: 'session',
        state: true,
      },
      ...config.AUTH_PROVIDERS,
    })
  )

  // Set API client
  app.use(setApiClient)

  // Set services
  app.use(setServices)

  // Development environment helpers
  if (config.IS_DEV) {
    require('axios-debug-log')
    const development = require('./common/middleware/development')
    app.use(development.bypassAuth(config.AUTH_BYPASS_SSO))
    app.use(development.setUserPermissions(config.USER_PERMISSIONS))
    app.use(development.setUserLocations(config.USER_LOCATIONS))
    app.use(development.setUsername(config.USER_USERNAME))
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
      // /csra picks its own location from the `agency` query param, so it
      // must not be bounced to the location chooser like other routes -
      // kept separate from AUTH_WHITELIST_URLS as it still requires auth
      whitelist: [...config.AUTH_WHITELIST_URLS, '/csra(.*)'],
    })
  )
  app.use(setLocations)
  app.use('.*(?<!image)$', setLocation)
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })
  // unsafe-inline is required as govuk-template injects `js-enabled` class via inline script
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
      contentSecurityPolicy: {
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'cdnjs.cloudflare.com',
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'region1.google-analytics.com',
            'cdn.jsdelivr.net',
            "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='",
            (req, res) => `'nonce-${res.locals.cspNonce}'`,
          ],
          connectSrc: [
            "'self'",
            "'unsafe-inline'",
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'region1.google-analytics.com',
            'api.os.uk',
            'region1.analytics.google.com',
            'stats.g.doubleclick.net',
          ],
          imgSrc: [
            "'self'",
            'www.google-analytics.com',
            'region1.google-analytics.com',
            'api.os.uk',
            'data: blob:',
            'images.ctfassets.net',
            'www.google.co.uk/ads/ga-audiences',
          ],
          fontSrc: ["'self'", 'fonts.googleapis.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        },
      },
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })
  )

  // Ensure body processed after reauthentication
  app.use(processOriginalRequestBody())

  // Add permission checker
  app.use(setCanAccess)

  // Routing
  app.use(setPrimaryNavigation)

  if (config.ENABLE_DEVELOPMENT_TOOLS) {
    app.use(setDevelopmentTools)
  }

  app.use(router)

  // error handling
  Sentry.setupExpressErrorHandler(app)
  app.use(errorHandlers.notFound)
  app.use(errorHandlers.catchAll(config.IS_DEV))

  return app
}
