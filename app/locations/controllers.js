const { find, sortBy } = require('lodash')

function locations(req, res) {
  const locations = sortBy(req.userLocations, 'title')

  res.render('locations/views/locations.njk', {
    locations,
  })
}

function setLocation(req, res, next) {
  const { locationId } = req.params
  const location = find(req.userLocations, { id: locationId })

  if (!location) {
    return next()
  }

  req.session.currentLocation = location

  res.redirect('/')
}

function setAllLocations(req, res, next) {
  const { permissions = [] } = req.session.user || {}

  if (!permissions.includes('moves:view:all')) {
    return next()
  }

  req.session.currentLocation = null

  res.redirect('/')
}

module.exports = {
  locations,
  setLocation,
  setAllLocations,
}
