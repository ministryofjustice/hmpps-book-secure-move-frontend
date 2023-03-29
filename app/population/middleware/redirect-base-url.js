const { format } = require('date-fns')

const { DATE_FORMATS } = require('../../../config/index')

function redirectBaseUrl(req, res) {
  const { viewDate, period } = req.session

  const today = viewDate || format(new Date(), DATE_FORMATS.URL_PARAM)
  const viewPeriod = period || 'week'

  return res.redirect(`${req.baseUrl}/${viewPeriod}/${today}`)
}

module.exports = redirectBaseUrl
