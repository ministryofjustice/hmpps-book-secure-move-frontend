const { set } = require('lodash')

function setBodyAllocations(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.allocations', {
    fromLocationId: locationId,
    moveDate: dateRange,
    status,
  })

  next()
}

module.exports = setBodyAllocations
