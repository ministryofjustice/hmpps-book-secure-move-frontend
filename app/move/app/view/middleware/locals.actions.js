module.exports = function (req, res, next) {
  const { canAccess, move = {} } = req

  res.locals.actions = [
    {
      text: 'actions::view_journeys',
      url: canAccess('move:view:journeys')
        ? `/move/${move.id}/journeys`
        : undefined,
    },
    {
      text: 'actions::cancel_lodge',
      classes: 'app-link--destructive',
      url: canAccess('move:lodging:cancel')
        ? `/move/${move.id}/lodging/cancel`
        : undefined,
    },
    {
      text: 'actions::cancel_move',
      classes: 'app-link--destructive',
      url: move._canCancel ? `/move/${move.id}/cancel` : undefined,
    },
  ].filter(action => action.url)

  next()
}
