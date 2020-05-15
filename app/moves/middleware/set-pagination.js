const { format } = require('date-fns')
const { isEmpty } = require('lodash')
const pathToRegexp = require('path-to-regexp')
const querystring = require('qs')

const dateHelpers = require('../../../common/helpers/date-utils')
const { DATE_FORMATS } = require('../../../config')

function setPagination(route) {
  return function handlePagination(req, res, next) {
    const { baseUrl, params, path, query } = req
    const { date, period } = params
    const matched = pathToRegexp.match(route)(baseUrl + path)

    if (matched) {
      const today = format(new Date(), DATE_FORMATS.URL_PARAM)
      const interval = period === 'week' ? 7 : 1
      const previousDate = dateHelpers.getRelativeDate(date, -interval)
      const nextDate = dateHelpers.getRelativeDate(date, interval)
      const compileUrl = pathToRegexp.compile(route)
      const queryInUrl = !isEmpty(query)
        ? `?${querystring.stringify(query)}`
        : ''

      req.pagination = {
        todayUrl: compileUrl({ ...matched.params, date: today }) + queryInUrl,
        nextUrl: compileUrl({ ...matched.params, date: nextDate }) + queryInUrl,
        prevUrl:
          compileUrl({ ...matched.params, date: previousDate }) + queryInUrl,
      }
    }

    next()
  }
}

module.exports = setPagination
