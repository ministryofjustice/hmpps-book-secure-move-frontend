const { get } = require('lodash')

const permissions = require('../../middleware/permissions')

module.exports = function listAsCards(req, res) {
  const { actions, context, pagination, params, resultsAsCards, session } = req
  const userPermissions = get(session, 'user.permissions')
  const canViewMove = permissions.check('move:view', userPermissions)
  const template =
    canViewMove && params.locationId
      ? 'collection-as-cards'
      : 'moves/views/download'
  const locals = {
    actions,
    context,
    pagination,
    resultsAsCards,
  }

  res.render(template, locals)
}
