const { find, reject, sumBy } = require('lodash')

const presenters = require('../../../common/presenters')

function setDashboardMoveSummary(req, res, next) {
  const { moveTypeNavigation } = res.locals
  const totalMoves = {
    label: 'moves::dashboard.filter.total',
    filter: 'total',
    href: find(moveTypeNavigation, { filter: 'pending' }).href,
    value: sumBy(moveTypeNavigation, 'value'),
  }

  res.locals.dashboardMoveSummary = [
    presenters.moveTypesToFilterComponent(totalMoves),
    ...reject(moveTypeNavigation, { filter: 'pending' }),
  ]

  next()
}

module.exports = setDashboardMoveSummary
