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
    ].filter(action => action.url)

    actions.push({
      text: 'messages::preview_new_feature.actions.return',
      itemClasses:
        actions.length !== 0
          ? 'app-border-top-1 govuk-!-padding-top-4 govuk-!-margin-top-4'
          : undefined,
      classes: 'govuk-button govuk-button--secondary govuk-!-margin-top-4',
      url: `/move${previewPrefix}/opt-out?move_id=${move.id}`,
    })

    res.locals.actions = actions

    next()
  }
}

module.exports = setActions
