module.exports = function listAsCards(req, res) {
  const { actions, context, datePagination, params, resultsAsCards } = req
  const { dateRange, locationId, period } = params
  const canViewMove = req.canAccess('move:view')
  const template =
    canViewMove && locationId ? 'collection-as-cards' : 'moves/views/download'
  const locals = {
    actions,
    context,
    dateRange,
    datePagination,
    period,
    resultsAsCards,
  }

  res.render(template, locals)
}
