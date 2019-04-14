// Core dependencies
const path = require('path')

// NPM dependencies
const bodyParser = require('body-parser')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const express = require('express')
const nunjucks = require('nunjucks')

const router = require('./app/router')

const app = express()

// view engine setup
app.set('view engine', 'njk')
nunjucks.configure([
  `./app/views`,
], {
  autoescape: true,
  express: app,
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routing
app.use(router)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
