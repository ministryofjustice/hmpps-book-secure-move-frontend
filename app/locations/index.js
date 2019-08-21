// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { locations, setLocation } = require('./controllers')
const { setUserLocations, checkLocationsLength } = require('./middleware')

router.use(setUserLocations)

// Define routes
router.get('/', checkLocationsLength, locations)
router.get('/:locationId', setLocation)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
