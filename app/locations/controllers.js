const { sortBy } = require('lodash')

function locations(req, res) {
  const locations = sortBy(req.userLocations, 'title')

  res.render('locations/views/locations.njk', {
    locations,
  })
}

function redirect(req, res) {
  const redirectUrl = req.session.originalRequestUrl || '/'

  req.session.originalRequestUrl = null

  res.redirect(redirectUrl)
}

module.exports = {
  locations,
  redirect,
}
