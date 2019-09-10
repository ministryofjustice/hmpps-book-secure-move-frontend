const { get } = require('lodash')

const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { cancelledMovesByDate = [], requestedMovesByDate = [] } = res.locals
  const userPermissions = get(req.session, 'user.permissions')
  const canViewMove = permissions.check('move:view', userPermissions)
  const template = canViewMove ? 'moves/views/list' : 'moves/views/download'
  const locals = {
    pageTitle: 'moves::dashboard.upcoming_moves',
    destinations: presenters.movesByToLocation(requestedMovesByDate),
    cancelledMoves: cancelledMovesByDate.map(
      presenters.moveToCardComponent({
        showMeta: false,
        showTags: false,
      })
    ),
  }

  res.render(template, locals)
}
