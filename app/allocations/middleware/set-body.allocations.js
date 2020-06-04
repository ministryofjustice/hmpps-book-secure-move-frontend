const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date-utils')

function setBodyAllocations(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.allocations', {
    status,
    moveDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    fromLocationId: locationId,
  })

  next()
}

module.exports = setBodyAllocations
