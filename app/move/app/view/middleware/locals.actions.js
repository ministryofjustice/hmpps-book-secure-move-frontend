const getCanCancelMove = require('../../../../../common/helpers/move/get-can-cancel-move')

function setActions(req, res, next) {
  const { move = {} } = req
  const userPermissions = req.session?.user?.permissions

  const actions = [
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
