// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { locations, setLocation } = require('./controllers')

// Define routes
router.get('/', locations)
router.get('/:locationId', setLocation)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
