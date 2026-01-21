const { format } = require('date-fns')
const { get, isEmpty } = require('lodash')
const querystring = require('qs')

const { DATE_FORMATS } = require('../../../config')

function redirectView(defaults = {}) {
  return function handleViewRedirect(req, res, next) {
    const { view } = req.params
    let { period, viewDate, group_by: groupBy } = req.session

    if (!view) {
      return next()
    }

    if (!viewDate) {
      viewDate = format(new Date(), DATE_FORMATS.URL_PARAM)
    }

    const timePeriod = period || defaults[view] || 'day'
    const currentLocationId = get(req.session, 'currentLocation.id')
    const locationInUrl = currentLocationId ? `/${currentLocationId}` : ''

    const queryInUrl = getQueryParams(req.query, groupBy)

    return res.redirect(
      `${req.baseUrl}/${timePeriod}/${viewDate}${locationInUrl}/${view}${queryInUrl}`
    )
  }
}

function getQueryParams(existingQuery, groupBy) {
  if (isEmpty(existingQuery) && isEmpty(groupBy)) {
    return ''
  }

  if (isEmpty(existingQuery)) {
    return `?group_by=${groupBy}`
  }

  return `?${querystring.stringify({ ...existingQuery, group_by: groupBy })}`
}

module.exports = redirectView
