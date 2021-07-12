// NPM dependencies
const router = require('express').Router()

// Local dependencies
const { protectRoute } = require('../../common/middleware/permissions')
const { redirect } = require('../auth/controllers')

const { locations } = require('./controllers')
const {
  checkLocationsLength,
  setLocation,
  setRegion,
  setAllLocations,
  setHasSelectedLocation,
} = require('./middleware')

// Define routes
router.get('/', checkLocationsLength, locations)
router.get(
  '/all',
  protectRoute('locations:all'),
  setAllLocations,
  setHasSelectedLocation,
  redirect
)
router.get('/:locationId', setLocation, setHasSelectedLocation, redirect)
router.get('/regions/:regionId', setRegion, setHasSelectedLocation, redirect)

// Export
module.exports = {
  router,
  mountpath: '/locations',
}
