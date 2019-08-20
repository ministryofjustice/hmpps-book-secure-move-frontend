const { get, sortBy } = require('lodash')

function locations(req, res) {
  const locations = get(req.session, 'user.locations', [])

  res.render('locations/views/locations.njk', {
    locations: sortBy(locations, 'title'),
  })
}

module.exports = {
  locations,
}
