const { format } = require('date-fns')

const {
  getDateFromParams,
  getPeriod,
  dateFormat,
} = require('../../../common/helpers/date-utils')

function setPagination(req, res, next) {
  const { locationId = '', period, status, view } = req.params
  const today = format(new Date(), dateFormat)
  const baseDate = getDateFromParams(req)
  const interval = period === 'week' ? 7 : 1

  const previousPeriod = getPeriod(baseDate, -interval)
  const nextPeriod = getPeriod(baseDate, interval)

  const locationInUrl = locationId ? `/${locationId}` : ''
  const viewInUrl = status || view ? `/${status || view}` : ''

  res.locals.pagination = {
    todayUrl: `${req.baseUrl}/${period}/${today}${locationInUrl}${viewInUrl}`,
    nextUrl: `${req.baseUrl}/${period}/${nextPeriod}${locationInUrl}${viewInUrl}`,
    prevUrl: `${req.baseUrl}/${period}/${previousPeriod}${locationInUrl}${viewInUrl}`,
  }

  next()
}

module.exports = setPagination
