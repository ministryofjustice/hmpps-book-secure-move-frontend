const { set } = require('lodash')

function setBodyAllocations(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.allocations', {
    status,
    moveDate: dateRange,
    fromLocationId: locationId,
  })

  next()
}

module.exports = setBodyAllocations
