// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const session = require('express-session')
const grant = require('grant-express')
const flash = require('connect-flash')
const favicon = require('serve-favicon')
const slashify = require('slashify')
const i18nMiddleware = require('i18next-express-middleware')
const Sentry = require('@sentry/node')

// Local dependencies
const config = require('./config')
const configPaths = require('./config/paths')
const logger = require('./config/logger')
const i18n = require('./config/i18n')
const nunjucks = require('./config/nunjucks')
const redisStore = require('./config/redis-store')
const setCurrentLocation = require('./common/middleware/set-current-location')
const errorHandlers = require('./common/middleware/errors')
const checkSession = require('./common/middleware/check-session')
const ensureAuthenticated = require('./common/middleware/ensure-authenticated')
const locals = require('./common/middleware/locals')
const router = require('./app/router')
const healthcheckApp = require('./app/healthcheck')

if (config.SENTRY.DSN) {
  Sentry.init({
    dsn: config.SENTRY.DSN,
    environment: config.SENTRY.ENVIRONMENT,
    release: config.GIT_SHA,
  })
}

// Global constants
const app = express()

if (config.IS_PRODUCTION) {
  app.enable('trust proxy')
}

app.use(Sentry.Handlers.requestHandler())

app.use(slashify())

// Load the healthcheck app manually before anything
// else to ensure it will return some kind of response
// regardless of the app failing elsewhere
app.use(healthcheckApp.mountpath, healthcheckApp.router)

// view engine setup
app.set('view engine', 'njk')
nunjucks(app, config, configPaths)

// Static files
app.use(favicon(path.join(configPaths.build, 'images', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(configPaths.build))
app.use(
  '/assets',
  express.static(
    path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')
  )
)

// ensure i18n is loaded early as needed for error template
app.use(i18nMiddleware.handle(i18n))
app.use(morgan('dev'))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(
  session({
    store: redisStore({
      ...config.REDIS.SESSION,
      logErrors: error => logger.error(error),
    }),
    secret: config.SESSION.SECRET,
    name: config.SESSION.NAME,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: config.IS_PRODUCTION,
      maxAge: config.SESSION.TTL,
      httpOnly: true,
    },
  })
)
app.use(checkSession)
app.use(flash())
app.use(locals)
app.use(
  grant({
    defaults: {
      protocol: config.IS_PRODUCTION ? 'https' : 'http',
      host: config.SERVER_HOST,
      callback: '/auth/callback',
      transport: 'session',
      state: true,
    },
    ...config.AUTH_PROVIDERS,
  })
)
// Development environment helpers
if (config.IS_DEV) {
  const development = require('./common/middleware/development')
  app.use(development.bypassAuth(config.AUTH_BYPASS_SSO))
  app.use(development.setUserPermissions(config.USER_PERMISSIONS))
}
app.use(
  ensureAuthenticated({
    provider: config.DEFAULT_AUTH_PROVIDER,
    whitelist: config.AUTH_WHITELIST_URLS,
  })
)
app.use(setCurrentLocation)
app.use(helmet())

// Routing
app.use(router)

// error handling
app.use(Sentry.Handlers.errorHandler())
app.use(errorHandlers.notFound)
app.use(errorHandlers.catchAll(config.IS_DEV))

module.exports = app
