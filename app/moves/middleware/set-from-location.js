const { find, get } = require('lodash')

function setFromLocation(req, res, next, locationId) {
  const userLocations = get(req.session, 'user.locations')
  const location = find(userLocations, { id: locationId })

  if (!location) {
    const error = new Error('Location not found')
    error.statusCode = 404

    return next(error)
  }

  req.locations = locationId

  if (req.session?.currentLocation.id !== location?.id) {
    res.locals.locationName = location.title
  }

  res.locals.fromLocationId = locationId

  next()
}

module.exports = setFromLocation
