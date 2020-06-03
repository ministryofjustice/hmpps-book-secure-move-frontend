const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodyAllocations(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.allocations', {
    status,
    sortBy,
    sortDirection,
    moveDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    fromLocationId: locationId,
  })

  next()
}

module.exports = setBodyAllocations
