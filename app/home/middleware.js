const { format, endOfWeek, startOfWeek } = require('date-fns')
const { get } = require('lodash')

const { DATE_FORMATS } = require('../../config')

function overrideBodySingleRequests(req, res, next) {
  const startDate = format(
    startOfWeek(new Date(), {
      weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
    }),
    DATE_FORMATS.URL_PARAM
  )
  const endDate = format(
    endOfWeek(new Date(), {
      weekStartsOn: DATE_FORMATS.WEEK_STARTS_ON,
    }),
    DATE_FORMATS.URL_PARAM
  )

  req.body.requested = {
    ...req.body.requested,
    createdAtDate: [startDate, endDate],
    fromLocationId: get(req.session, 'currentLocation.id'),
  }

  req.body.allocations = {
    ...req.body.allocations,
    moveDate: [startDate, endDate],
    fromLocationId: get(req.session, 'currentLocation.id'),
  }

  next()
}

module.exports = {
  overrideBodySingleRequests,
}
