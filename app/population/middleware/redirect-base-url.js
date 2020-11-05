const { format } = require('date-fns')

const { DATE_FORMATS } = require('../../../config/index')

function redirectBaseUrl(req, res) {
  const today = format(new Date(), DATE_FORMATS.URL_PARAM)

  return res.redirect(`${req.baseUrl}/week/${today}`)
}

module.exports = redirectBaseUrl
