function setActions({ previewPrefix = '' } = {}) {
  return (req, res, next) => {
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
      {
        text: 'actions::view_old_move_design',
        url: `/move${previewPrefix}/opt-out?move_id=${move.id}`,
      },
    ]

    res.locals.actions = actions.filter(item => item.url)

    next()
  }
}

module.exports = setActions
