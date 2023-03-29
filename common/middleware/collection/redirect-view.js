const { format } = require('date-fns')
const { get, isEmpty } = require('lodash')
const querystring = require('qs')

const { DATE_FORMATS } = require('../../../config')

function redirectView(defaults = {}) {
  return function handleViewRedirect(req, res, next) {
    const { view } = req.params
    let { period, viewDate } = req.session

    if (!view) {
      return next()
    }

    if (!viewDate) {
      viewDate = format(new Date(), DATE_FORMATS.URL_PARAM)
    }

    const timePeriod = period || defaults[view] || 'day'
    const currentLocationId = get(req.session, 'currentLocation.id')
    const locationInUrl = currentLocationId ? `/${currentLocationId}` : ''
    const queryInUrl = !isEmpty(req.query)
      ? `?${querystring.stringify(req.query)}`
      : ''

    return res.redirect(
      `${req.baseUrl}/${timePeriod}/${viewDate}${locationInUrl}/${view}${queryInUrl}`
    )
  }
}

module.exports = redirectView
