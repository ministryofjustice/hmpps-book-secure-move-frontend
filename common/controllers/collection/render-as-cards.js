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
    ...(hasDifferentOrDisabledDisplayLocation && { location }),
  }

  res.render('collection-as-cards', locals)
}
