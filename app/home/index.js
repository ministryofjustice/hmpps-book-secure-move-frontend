// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const { home } = require('./controllers')

// Define routes
router.get('/', home)

// Export
module.exports = {
  router,
  mountpath: '/',
}
