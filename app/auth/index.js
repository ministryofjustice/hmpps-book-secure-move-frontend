// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { redirect, signOut } = require('./controllers')
const { processAuthResponse } = require('./middleware')
const { CURRENT_LOCATION_UUID } = require('../../config')

// Define routes
router.get('/', redirect)
router.get('/callback', processAuthResponse([CURRENT_LOCATION_UUID]), redirect)
router.get('/sign-out', signOut)

// Export
module.exports = {
  router,
  mountpath: '/auth',
}
