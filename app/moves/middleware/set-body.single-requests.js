const { set } = require('lodash')

function setBodySingleRequests(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.requested', {
    status,
    createdAtDate: dateRange,
    fromLocationId: locationId,
  })

  next()
}

module.exports = setBodySingleRequests
