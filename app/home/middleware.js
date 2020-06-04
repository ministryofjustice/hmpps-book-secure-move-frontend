const { get } = require('lodash')

function overrideBodySingleRequests(req, res, next) {
  req.body.requested = {
    ...req.body.requested,
    fromLocationId: get(req.session, 'currentLocation.id'),
  }

  req.body.allocations = {
    ...req.body.allocations,
    fromLocationId: get(req.session, 'currentLocation.id'),
  }

  next()
}

module.exports = {
  overrideBodySingleRequests,
}
