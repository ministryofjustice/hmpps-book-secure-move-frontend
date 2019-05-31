// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { get } = require('./controllers')
const { processAuthResponse } = require('../../common/middleware/authentication')

// Load router middleware
router.use(processAuthResponse)

// Define routes
router.get('/', get)

// Export
module.exports = {
  router,
  mountpath: '/auth',
}
