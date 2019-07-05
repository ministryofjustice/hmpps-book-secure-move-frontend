// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { redirect } = require('./controllers')
const { processAuthResponse } = require('./middleware')

// Define routes
router.get('/', redirect)
router.get('/callback', processAuthResponse, redirect)

// Export
module.exports = {
  router,
  mountpath: '/auth',
}
