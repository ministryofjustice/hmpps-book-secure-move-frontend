const { format } = require('date-fns')
const { isEmpty } = require('lodash')
const querystring = require('qs')

const { getPeriod } = require('../../../common/helpers/date-utils')
const { DATE_FORMATS } = require('../../../config')

function setPagination(req, res, next) {
  const { date, locationId = '', period, view } = req.params
  const today = format(new Date(), DATE_FORMATS.URL_PARAM)
  const interval = period === 'week' ? 7 : 1

  const previousPeriod = getPeriod(date, -interval)
  const nextPeriod = getPeriod(date, interval)

  const locationInUrl = locationId ? `/${locationId}` : ''
  const queryInUrl = !isEmpty(req.query)
    ? `?${querystring.stringify(req.query)}`
    : ''

  res.locals.pagination = {
    todayUrl: `${req.baseUrl}/${period}/${today}${locationInUrl}/${view +
      queryInUrl}`,
    nextUrl: `${req.baseUrl}/${period}/${nextPeriod}${locationInUrl}/${view +
      queryInUrl}`,
    prevUrl: `${
      req.baseUrl
    }/${period}/${previousPeriod}${locationInUrl}/${view + queryInUrl}`,
  }

  next()
}

module.exports = setPagination
