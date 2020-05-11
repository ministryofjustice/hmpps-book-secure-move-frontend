const { find, reject, sumBy } = require('lodash')

const presenters = require('../../../common/presenters')

function setDashboardMoveSummary(req, res, next) {
  const { filter } = req
  const totalMoves = {
    label: 'moves::dashboard.filter.total',
    status: 'total',
    href: find(filter, { status: 'pending' }).href,
    value: sumBy(filter, 'value'),
  }

  res.locals.dashboardMoveSummary = [
    presenters.moveTypesToFilterComponent(totalMoves),
    ...reject(filter, { status: 'pending' }),
  ]

  next()
}

module.exports = setDashboardMoveSummary
