function setActions(req, res, next) {
  const { canAccess, move = {} } = req

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
      url: move._canCancel ? `/move/${move.id}/cancel` : undefined,
    },
  ]

  res.locals.actions = actions.filter(item => item.url)

  next()
}

module.exports = setActions
