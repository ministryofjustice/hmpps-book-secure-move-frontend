// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { locations } = require('./controllers')

// Define routes
router.get('/', locations)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
