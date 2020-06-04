const { get } = require('lodash')

function overrideLocationId(req, res, next) {
  req.params.locationId = get(req.session, 'currentLocation.id')

  next()
}

module.exports = {
  overrideLocationId,
}
