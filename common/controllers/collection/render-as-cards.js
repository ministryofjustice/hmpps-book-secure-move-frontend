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

  const {
    CURRENT_LOCATION: resLocation,
    CURRENT_REGION: resRegion,
  } = res.locals

  const hasDifferentDisplayLocation =
    resRegion || (resLocation && location && location?.id !== resLocation?.id)

  const filteredActions = hasDifferentDisplayLocation
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
    resultsAsCards,
    activeStatus: query.status,
    totalResults: sumBy(filter, 'value'),
    ...(hasDifferentDisplayLocation && { location }),
  }
  res.render(template, locals)
}
