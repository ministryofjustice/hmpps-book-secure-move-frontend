const { isToday, isTomorrow, isYesterday, isThisWeek } = require('date-fns')
const { sumBy } = require('lodash')

module.exports = function listAsTable(req, res) {
  const { actions, context, filter, pagination, resultsAsTable } = req
  const { dateRange, period } = req.params

  res.render('collection-as-table', {
    actions,
    context,
    dateRange,
    filter,
    pagination,
    period,
    resultsAsTable,
    activeStatus: req.query.status,
    totalResults: sumBy(filter, 'value'),
    displayRelativeDate:
      isToday(new Date(dateRange[0])) ||
      isTomorrow(new Date(dateRange[0])) ||
      isYesterday(new Date(dateRange[0])) ||
      isThisWeek(new Date(dateRange[0])) ||
      isThisWeek(new Date(dateRange[1])),
  })
}
