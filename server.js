// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const grant = require('grant-express')
const RedisStore = require('connect-redis')(session)

// Local dependencies
const config = require('./config')
const configPaths = require('./config/paths')
const nunjucks = require('./config/nunjucks')
const errorHandlers = require('./common/middleware/errors')
const router = require('./app/router')
const locals = require('./common/middleware/locals')

// Global constants
const app = express()

// view engine setup
app.set('view engine', 'njk')
nunjucks(app, config, configPaths)

// Locals
app.use(locals)

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(session({
  store: new RedisStore({
    host: config.REDIS.HOST,
    port: config.REDIS.PORT,
    db: config.SESSION.REDIS_STORE_DATABASE,
  }),
  name: 'pecs-id',
  secret: config.SESSION.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.IS_PRODUCTION,
    maxAge: 1800000, // 30 mins
    httpOnly: true,
  },
}))

app.use(grant({
  defaults: {
    protocol: 'http',
    host: config.SERVER_HOST,
    transport: 'session',
    state: true,
  },
  okta: {
    key: config.AUTH.PROVIDER_KEY,
    secret: config.AUTH.PROVIDER_SECRET,
    scope: ['openid', 'groups', 'profile'],
    nonce: true,
    subdomain: config.AUTH.OKTA_SUBDOMAIN,
    callback: '/auth',
  },
}))

// Static files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(configPaths.build))
app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

// Routing
app.use(router)

// error handling
app.use(errorHandlers.notFound)
app.use(errorHandlers.catchAll(config.IS_DEV))

module.exports = app
