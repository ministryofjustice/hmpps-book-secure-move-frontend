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

function getError(type) {
  const error = new Error(`${type} not found`)
  error.statusCode = 404
  return error
}

const locationTypes = ['currentLocation', 'currentRegion']

function setSelectedLocation(req, locationKey, locationValue) {
  locationTypes.forEach(type => {
    delete req.session[type]
  })

  if (locationKey) {
    req.session[locationKey] = locationValue
  }
}

function setLocation(req, res, next) {
  const { locationId } = req.params

  const location = find(req.userLocations, { id: locationId })

  if (!location) {
    return next(getError('Location'))
  }

  external.setSelectedLocation(req, 'currentLocation', location)

  next()
}

async function setRegion(req, res, next) {
  const { regionId } = req.params

  let region

  try {
    region = await req.services.referenceData.getRegionById(regionId)

    if (!region) {
      throw getError('Region')
    }
  } catch (error) {
    return next(error)
  }

  external.setSelectedLocation(req, 'currentRegion', region)
  next()
}

function setAllLocations(req, res, next) {
  external.setSelectedLocation(req)

  next()
}

function setHasSelectedLocation(req, res, next) {
  req.session.hasSelectedLocation = true
  next()
}

const external = {
  setUserLocations,
  checkLocationsLength,
  setLocation,
  setRegion,
  setAllLocations,
  setHasSelectedLocation,
  setSelectedLocation,
}

module.exports = external
