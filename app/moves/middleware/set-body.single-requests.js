const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date')

function setBodySingleRequests(req, res, next) {
  const { status } = req.query
  const useMoveDate = status === 'approved'
  const {
    sortBy = useMoveDate ? 'date' : undefined,
    sortDirection = useMoveDate ? 'asc' : undefined,
  } = req.query
  const { dateRange, locationId } = req.params
  const locations = locationId || req.locations

  const dateType = useMoveDate ? 'moveDate' : 'createdAtDate'
  const dateTypeRange = dateRange || dateHelpers.getCurrentWeekAsRange()

  set(req, 'body.requested', {
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
