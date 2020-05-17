const { get } = require('lodash')

const permissions = require('../../../common/middleware/permissions')

module.exports = function listAsCards(req, res) {
  const { pagination, params, resultsAsCards, session } = req
  const userPermissions = get(session, 'user.permissions')
  const canViewMove = permissions.check('move:view', userPermissions)
  const template =
    canViewMove && params.locationId
      ? 'moves/views/list-as-cards'
      : 'moves/views/download'
  const locals = {
    pagination,
    resultsAsCards,
    pageTitle: 'moves::dashboard.outgoing_moves',
  }

  res.render(template, locals)
}
