const { set } = require('lodash')

const dateHelpers = require('../../../common/helpers/date-utils')

function setBodySingleRequests(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  set(req, 'body.requested', {
    status,
    createdAtDate: dateRange || dateHelpers.getCurrentWeekAsRange(),
    fromLocationId: locationId,
  })

  next()
}

module.exports = setBodySingleRequests
