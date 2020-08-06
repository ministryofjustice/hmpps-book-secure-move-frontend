const { isToday, isTomorrow, isYesterday, isThisWeek } = require('date-fns')

const permissions = require('../../middleware/permissions')

module.exports = function listAsCards(req, res) {
  const { actions, context, pagination, params, resultsAsCards, session } = req
  const { dateRange, locationId, period } = params
  const userPermissions = session?.user?.permissions ?? []
  const canViewMove = permissions.check('move:view', userPermissions)
  const template =
    canViewMove && locationId ? 'collection-as-cards' : 'moves/views/download'
  const locals = {
    actions,
    context,
    dateRange,
    pagination,
    period,
    resultsAsCards,
    displayRelativeDate:
      isToday(new Date(dateRange[0])) ||
      isTomorrow(new Date(dateRange[0])) ||
      isYesterday(new Date(dateRange[0])) ||
      isThisWeek(new Date(dateRange[0])) ||
      isThisWeek(new Date(dateRange[1])),
  }

  res.render(template, locals)
}
