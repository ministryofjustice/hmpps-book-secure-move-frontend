// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { redirect } = require('../auth/controllers')

const { locations } = require('./controllers')
const {
  setUserLocations,
  checkLocationsLength,
  setLocation,
  setAllLocations,
} = require('./middleware')

router.use(setUserLocations)

// Define routes
router.get('/', checkLocationsLength, locations)
router.get('/all', setAllLocations, redirect)
router.get('/:locationId', setLocation, redirect)

// Export
module.exports = {
  mountpath: '/locations',
  router,
}
