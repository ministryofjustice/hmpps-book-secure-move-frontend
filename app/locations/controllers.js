const { get, sortBy } = require('lodash')

function locations(req, res) {
  const userPermissions = get(req.session, 'user.permissions', [])

  let locations

  if (userPermissions.includes('allocation:create')) {
    locations = req.session.regions
  } else {
    locations = sortBy(req.userLocations, 'title')
  }

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
