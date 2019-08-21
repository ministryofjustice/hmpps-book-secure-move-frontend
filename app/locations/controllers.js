const { find, get, sortBy } = require('lodash')

function locations(req, res) {
  const locations = get(req.session, 'user.locations', [])

  res.render('locations/views/locations.njk', {
    locations: sortBy(locations, 'title'),
  })
}

function setLocation(req, res, next) {
  const { locationId } = req.params
  const locations = get(req.session, 'user.locations', [])
  const location = find(locations, { id: locationId })

  if (!location) {
    return next()
  }

  req.session.currentLocation = location

  res.redirect('/')
}

module.exports = {
  locations,
  setLocation,
}
