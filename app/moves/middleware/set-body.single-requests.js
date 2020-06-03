const { set } = require('lodash')

function setBodySingleRequests(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.requested', {
    createdAtDate: dateRange,
    fromLocationId: locationId,
    status,
  })

  next()
}

module.exports = setBodySingleRequests
