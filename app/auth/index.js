// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { redirect, signOut } = require('./controllers')
const { processAuthResponse } = require('./middleware')

// Define routes
router.get('/', redirect)
router.get('/callback', processAuthResponse, redirect)
router.get('/sign-out', signOut)

// Export
module.exports = {
  router,
  mountpath: '/auth',
}
