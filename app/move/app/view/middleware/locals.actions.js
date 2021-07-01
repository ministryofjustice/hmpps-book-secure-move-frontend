const getCanCancelMove = require('../../../../../common/helpers/move/get-can-cancel-move')

function setActions(req, res, next) {
  const { canAccess, move = {} } = req
  const userPermissions = req.session?.user?.permissions

  const actions = [
    {
      text: 'actions::view_journeys',
      url: canAccess('move:view:journeys')
        ? `/move/${move.id}/journeys`
        : undefined,
    },
    {
      text: 'actions::cancel_move',
      classes: 'app-link--destructive',
      url: getCanCancelMove(move, userPermissions)
        ? `/move/${move.id}/cancel`
        : undefined,
    },
  ]

  res.locals.actions = actions.filter(item => item.url)

  next()
}

module.exports = setActions
