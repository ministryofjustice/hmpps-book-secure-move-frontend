// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { locations, setAllLocations, setLocation } = require('./controllers')
const { setUserLocations, checkLocationsLength } = require('./middleware')

router.use(setUserLocations)

// Define routes
router.get('/', checkLocationsLength, locations)
router.get('/all', setAllLocations)
router.get('/:locationId', setLocation)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
