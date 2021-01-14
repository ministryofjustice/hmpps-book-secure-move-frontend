const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodySingleRequests(req, res, next) {
  const { status, page = 1 } = req.query
  const useMoveDate = status === 'approved'
  const {
    sortBy = useMoveDate ? 'date' : undefined,
    sortDirection = useMoveDate ? 'asc' : undefined,
  } = req.query
  const { dateRange } = req.params
  const locations = req.locations
  const dateType = useMoveDate ? 'moveDate' : 'createdAtDate'
  const dateTypeRange = dateRange || dateHelpers.getCurrentWeekAsRange()

  set(req, 'body.requested', {
    page,
    status,
    sortBy,
    sortDirection,
    [dateType]: dateTypeRange,
    dateRange: dateTypeRange,
    fromLocationId: locations,
  })

  next()
}

module.exports = setBodySingleRequests
