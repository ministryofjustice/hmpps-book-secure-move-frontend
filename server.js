// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const grant = require('grant-express')
const flash = require('connect-flash')
const i18next = require('i18next')
const Backend = require('i18next-node-fs-backend')
const i18nMiddleware = require('i18next-express-middleware')

// Local dependencies
const config = require('./config')
const configPaths = require('./config/paths')
const logger = require('./config/logger')
const nunjucks = require('./config/nunjucks')
const redisStore = require('./config/redis-store')
const currentLocation = require('./common/middleware/current-location')
const errorHandlers = require('./common/middleware/errors')
const checkSession = require('./common/middleware/check-session')
const locals = require('./common/middleware/locals')
const router = require('./app/router')

i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en'],
  ns: [
    'default',
    'actions',
    'errors',
    'fields',
    'messages',
    'moves',
    'validation',
  ],
  defaultNS: 'default',
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json',
  },
})

// Global constants
const app = express()

// view engine setup
app.set('view engine', 'njk')
nunjucks(app, config, configPaths)

// Static files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(configPaths.build))
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

// ensure i18n is loaded early as needed for error template
app.use(i18nMiddleware.handle(i18next))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(session({
  store: redisStore({
    ...config.REDIS.SESSION,
    logErrors: (error) => logger.error(error),
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
}))
app.use(checkSession)
app.use(currentLocation(config.CURRENT_LOCATION_UUID))
app.use(flash())
app.use(locals)
app.use(grant({
  defaults: {
    protocol: 'http',
    host: config.SERVER_HOST,
    transport: 'session',
    state: true,
  },
  hmpps: {
    authorize_url: new URL('/auth/oauth/authorize', config.AUTH.PROVIDER_URL).href,
    access_url: new URL('/auth/oauth/token', config.AUTH.PROVIDER_URL).href,
    oauth: 2,
    key: config.AUTH.PROVIDER_KEY,
    secret: config.AUTH.PROVIDER_SECRET,
    scope: ['read'],
    callback: '/auth',
    token_endpoint_auth_method: 'client_secret_basic',
    response: ['tokens', 'jwt'],
  },
}))

// Routing
app.use(router)

// error handling
app.use(errorHandlers.notFound)
app.use(errorHandlers.catchAll(config.IS_DEV))

module.exports = app
