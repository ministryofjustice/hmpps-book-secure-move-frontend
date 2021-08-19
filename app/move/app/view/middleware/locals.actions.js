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
        text: 'messages::preview_new_feature.actions.return',
        itemClasses:
          'app-border-top-1 govuk-!-padding-top-4 govuk-!-margin-top-4',
        classes: 'govuk-button govuk-button--secondary',
        url: `/move${previewPrefix}/opt-out?move_id=${move.id}`,
      },
    ]

    res.locals.actions = actions.filter(item => item.url)

    next()
  }
}

module.exports = setActions
