const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodySingleRequests(req, res, next) {
  const { status, sortBy, sortDirection } = req.query
  const { dateRange } = req.params
  const locations = req.locations

  set(req, 'body.requested', {
    status,
    sortBy,
    sortDirection,
    createdAtDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    fromLocationId: locations,
  })

  next()
}

module.exports = setBodySingleRequests
