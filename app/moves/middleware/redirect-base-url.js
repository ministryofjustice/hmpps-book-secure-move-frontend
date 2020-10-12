const { format } = require('date-fns')
const { get } = require('lodash')

const { DATE_FORMATS } = require('../../../config/index')

function redirectBaseUrl(req, res) {
  const today = format(new Date(), DATE_FORMATS.URL_PARAM)
  const currentLocation = get(req.session, 'currentLocation')

  if (currentLocation) {
    const canViewProposedMoves = req.canAccess('moves:view:proposed')
    const url =
      canViewProposedMoves && currentLocation.location_type === 'prison'
        ? `${req.baseUrl}/week/${today}/${currentLocation.id}/requested`
        : `${req.baseUrl}/day/${today}/${currentLocation.id}/outgoing`
    return res.redirect(url)
  }

  return res.redirect(`${req.baseUrl}/day/${today}/outgoing`)
}

module.exports = redirectBaseUrl
