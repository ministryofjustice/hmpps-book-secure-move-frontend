const { get } = require('lodash')

module.exports = function currentLocation(req, res, next) {
  if (req.session.currentLocation) {
    return next()
  }

  const userLocations = get(req.session, 'user.locations', [])

  if (userLocations.length) {
    req.session.currentLocation = userLocations[0]
    return next()
  }

  next()
}
