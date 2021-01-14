const { get } = require('lodash')

function redirectBaseUrl(req, res) {
  const { baseUrl, canAccess, session } = req
  const currentLocation = get(session, 'currentLocation')

  if (
    canAccess('moves:view:proposed') &&
    currentLocation?.location_type === 'prison'
  ) {
    return res.redirect(`${baseUrl}/requested`)
  }

  return res.redirect(`${baseUrl}/outgoing`)
}

module.exports = redirectBaseUrl
