const { get } = require('lodash')

const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const {
    cancelledMovesByDate = [],
    activeMovesByDate = [],
    fromLocationId,
  } = res.locals
  const userPermissions = get(req.session, 'user.permissions')
  const canViewMove = permissions.check('move:view', userPermissions)
  const template =
    canViewMove && fromLocationId
      ? 'moves/views/list-as-cards'
      : 'moves/views/download'
  const locals = {
    pageTitle: 'moves::dashboard.outgoing_moves',
    destinations: presenters.movesByToLocation(activeMovesByDate),
    cancelledMoves: cancelledMovesByDate.map(
      presenters.moveToCardComponent({
        showMeta: false,
        showTags: false,
        showImage: false,
      })
    ),
  }

  res.render(template, locals)
}
