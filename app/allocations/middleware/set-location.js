const { find, get } = require('lodash')

const setLocation = (req, res, next, locationId) => {
  const userLocations = get(req.session, 'user.locations')
  const location = find(userLocations, { id: locationId })

  if (req.session?.currentLocation.id !== location?.id) {
    res.locals.locationName = location.title
  }

  next()
}

module.exports = setLocation
