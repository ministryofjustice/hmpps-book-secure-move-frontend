const { find, get } = require('lodash')

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

function setRegion(req, res, next) {
  const { regionId } = req.params

  req.session.currentLocation = null

  if (regionId) {
    req.session.currentRegion = find(req.session.regions, { id: regionId })
  } else {
    req.session.currentRegion = undefined
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
