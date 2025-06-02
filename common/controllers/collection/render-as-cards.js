const { sumBy } = require('lodash')

module.exports = function listAsCards(req, res) {
  const {
    actions,
    context,
    datePagination,
    filter,
    params,
    resultsAsCards,
    query,
    location,
  } = req

  const { CURRENT_LOCATION: resLocation, CURRENT_REGION: resRegion } =
    res.locals

  const disabledLocation =
    resLocation && location && (resLocation.disabled_at || location.disabled_at)

  const hasDifferentOrDisabledDisplayLocation =
    resRegion ||
    (resLocation && location && location?.id !== resLocation?.id) ||
    disabledLocation

  const filteredActions = hasDifferentOrDisabledDisplayLocation
    ? actions.filter(action => action.permission !== 'move:create')
    : actions

  const { dateRange, period } = params
  const canViewMove = req.canAccess('move:view')
  const template =
    canViewMove && location?.id ? 'collection-as-cards' : 'moves/views/download'
  const locals = {
    actions: filteredActions,
    context,
    filter,
    dateRange,
    datePagination,
    period,
    group_by: req.session?.group_by,
    resultsAsCards,
    activeStatus: query.status,
    totalResults: sumBy(filter, 'value'),
    ...(hasDifferentOrDisabledDisplayLocation && { location }),
  }
  res.render(template, locals)
}
