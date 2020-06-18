// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { redirect } = require('../auth/controllers')

const { locations } = require('./controllers')
const {
  setUserLocations,
  checkLocationsLength,
  setLocation,
  setRegion,
  setAllLocations,
  setRegions,
} = require('./middleware')

router.use(setUserLocations)

// Define routes
router.get('/', checkLocationsLength, setRegions, locations)
router.get('/all', setAllLocations, redirect)
router.get('/:locationId', setLocation, redirect)
router.get('/region/prisons/:regionId', setRegion, redirect)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
