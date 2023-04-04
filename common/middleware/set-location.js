const { findById } = require('../services/location')

// If we want to also use this as normal middleware, we can't have an extra property
// param, as normal middleware uses the 4th param for error handling
async function setLocation(req, res, next) {
  const locationId = req.params?.locationId || req.session?.currentLocation?.id

  if (!locationId) {
    return next()
  }

  const location = await findById(req, locationId, false)

  if (location) {
    req.location = location
    return next()
  }

  const error = new Error('Location not found')
  error.statusCode = 404
  return next(error)
}

module.exports = setLocation
