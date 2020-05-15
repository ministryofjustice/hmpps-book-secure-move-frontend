const { format } = require('date-fns')

const dateHelpers = require('../../../common/helpers/date-utils')
const urlHelpers = require('../../../common/helpers/url')
const { DATE_FORMATS } = require('../../../config')

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
    }

    next()
  }
}

module.exports = setPagination
