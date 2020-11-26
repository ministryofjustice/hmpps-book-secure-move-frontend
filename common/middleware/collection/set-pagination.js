const { format } = require('date-fns')

const DATESELECT = require('../../../app/date-select/constants')
const { DATE_FORMATS } = require('../../../config')
const dateHelpers = require('../../helpers/date')
const urlHelpers = require('../../helpers/url')

function setPagination(route) {
  return function handlePagination(req, res, next) {
    const { date, period } = req.params

    const today = format(new Date(), DATE_FORMATS.URL_PARAM)
    const interval = period === 'week' ? 7 : 1
    const prevDate = dateHelpers.getRelativeDate(date, -interval)
    const nextDate = dateHelpers.getRelativeDate(date, interval)

    req.pagination = {
      todayUrl: urlHelpers.compileFromRoute(route, req, { date: today }),
      nextUrl: urlHelpers.compileFromRoute(route, req, { date: nextDate }),
      prevUrl: urlHelpers.compileFromRoute(route, req, { date: prevDate }),
      dateSelectUrl: `${DATESELECT.MOUNTPATH}?referrer=${escape(
        req.originalUrl
      )}`,
    }

    next()
  }
}

module.exports = setPagination
