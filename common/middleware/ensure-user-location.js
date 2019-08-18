const { get } = require('lodash')

module.exports = function ensureUserLocation(req, res, next) {
  const userLocations = get(req.session, 'user.locations')
  const userRoles = get(req.session, 'user.roles')

  if (
    (Array.isArray(userLocations) && userLocations.length) ||
    (Array.isArray(userRoles) && userRoles.includes('PECS_ROLE_SUPPLIER'))
  ) {
    return next()
  }

  const error = new Error(`No locations found for user`)
  error.statusCode = 403

  next(error)
}
