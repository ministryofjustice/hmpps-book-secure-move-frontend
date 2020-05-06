const { addDays, getTime } = require('date-fns')

const referenceDataService = require('../services/reference-data')

function bypassAuth(bypass) {
  return (req, res, next) => {
    if (bypass) {
      const future = getTime(addDays(new Date(), 30))
      req.session.authExpiry = Math.floor(future / 1000)
    }
    next()
  }
}

function setUserPermissions(permissions) {
  return (req, res, next) => {
    if (permissions) {
      req.session.user = req.session.user || {}
      req.session.user.permissions = permissions.split(',')
    }
    next()
  }
}

function setUserLocations(locations) {
  return async (req, res, next) => {
    req.session.user = req.session.user || {}

    if (locations && !req.session.user.locations) {
      req.session.user.locations = await referenceDataService.getLocationsByNomisAgencyId(
        locations.split(',')
      )
    }
    next()
  }
}

module.exports = {
  bypassAuth,
  setUserPermissions,
  setUserLocations,
}
