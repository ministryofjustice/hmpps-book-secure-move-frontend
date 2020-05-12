const { format } = require('date-fns')
const { get } = require('lodash')

const { dateFormat } = require('../../../common/helpers/date-utils')
const permissions = require('../../../common/middleware/permissions')

function redirectBaseUrl(req, res) {
  const today = format(new Date(), dateFormat)
  const currentLocation = get(req.session, 'currentLocation')

  const userPermissions = get(req.session, 'user.permissions')

  const canViewAllocations = permissions.check(
    'allocations:view',
    userPermissions
  )
  if (canViewAllocations) {
    return res.redirect(`${req.baseUrl}/allocations`)
  }
  const canViewProposedMoves = permissions.check(
    'moves:view:proposed',
    userPermissions
  )
  if (currentLocation) {
    const url =
      canViewProposedMoves && currentLocation.location_type === 'prison'
        ? `${req.baseUrl}/week/${today}/${currentLocation.id}/`
        : `${req.baseUrl}/day/${today}/${currentLocation.id}/outgoing`
    return res.redirect(url)
  }
  return res.redirect(`${req.baseUrl}/day/${today}/outgoing`)
}

module.exports = redirectBaseUrl
