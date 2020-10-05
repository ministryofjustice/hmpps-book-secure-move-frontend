const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodySingleRequests(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params
  const locations = req.locations

  const dateTypeRange = dateRange || dateHelpers.getCurrentWeekAsRange()

  set(req, 'body.requested', {
    status,
    sortBy,
    sortDirection,
    createdAtDate: dateTypeRange,
    fromLocationId: locations,
  })

  next()
}

module.exports = setBodySingleRequests
