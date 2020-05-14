const { format } = require('date-fns')

const { getPeriod } = require('../../../common/helpers/date-utils')
const { DATE_FORMATS } = require('../../../config')

function setPagination(req, res, next) {
  const { date, locationId = '', period, view } = req.params
  const today = format(new Date(), DATE_FORMATS.URL_PARAM)
  const interval = period === 'week' ? 7 : 1

  const previousPeriod = getPeriod(date, -interval)
  const nextPeriod = getPeriod(date, interval)

  const locationInUrl = locationId ? `/${locationId}` : ''

  res.locals.pagination = {
    todayUrl: `${req.baseUrl}/${period}/${today}${locationInUrl}/${view}`,
    nextUrl: `${req.baseUrl}/${period}/${nextPeriod}${locationInUrl}/${view}`,
    prevUrl: `${req.baseUrl}/${period}/${previousPeriod}${locationInUrl}/${view}`,
  }

  next()
}

module.exports = setPagination
