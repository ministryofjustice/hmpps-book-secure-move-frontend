const { find, get } = require('lodash')

const referenceDataService = require('../../common/services/reference-data')

function setUserLocations(req, res, next) {
  req.userLocations = get(req.session, 'user.locations', [])
  next()
}

function checkLocationsLength(req, res, next) {
  if (req.userLocations.length === 1) {
    return res.redirect(`${req.baseUrl}/${req.userLocations[0].id}`)
  }

  next()
}

function setLocation(req, res, next) {
  const { locationId } = req.params

  const location = find(req.userLocations, { id: locationId })

  req.session.currentLocation = location
  next()
}

async function setRegion(req, res, next) {
  const { regionId } = req.params

  req.session.currentLocation = null

  if (!regionId) {
    req.session.currentRegion = null
    next()
    return
  }

  try {
    const regions = await referenceDataService.getRegions()
    req.session.currentRegion = find(regions, { id: regionId }) ?? null
  } catch (error) {
    req.session.currentRegion = null
    next(new Error('Failed to retrieve the regions'))
    return
  }

  next()
}

function setAllLocations(req, res, next) {
  const { permissions = [] } = req.session.user || {}

  if (!permissions.includes('locations:all')) {
    return next()
  }

  req.session.currentLocation = null
  next()
}

module.exports = {
  setUserLocations,
  checkLocationsLength,
  setLocation,
  setRegion,
  setAllLocations,
}
