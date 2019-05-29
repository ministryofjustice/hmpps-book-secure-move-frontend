// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const grant = require('grant-express')

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

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(session({
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
    host: 'localhost:3000',
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

// Locals
app.use(locals)

// Routing
router.bind(app)

// error handling
app.use(errorHandlers.notFound)
app.use(errorHandlers.catchAll(config.IS_DEV))

module.exports = app
