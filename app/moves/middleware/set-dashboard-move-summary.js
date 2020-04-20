const { find, reject } = require('lodash')

const presenters = require('../../../common/presenters')

function setDashboardMoveSummary(req, res, next) {
  let totalMoves = {
    label: 'moves::dashboard.filter.total',
    filter: 'total',
    href: find(res.locals.moveTypeNavigation, { filter: 'proposed' }).href,
  }
  totalMoves.value = res.locals.moveTypeNavigation.reduce(
    (accumulator, moveType) => {
      return (accumulator += moveType.value)
    },
    0
  )
  totalMoves = presenters.moveTypesToFilterComponent(totalMoves)
  res.locals.dashboardMoveSummary = [
    totalMoves,
    ...reject(res.locals.moveTypeNavigation, {
      filter: 'proposed',
    }),
  ]
  next()
}

module.exports = setDashboardMoveSummary
