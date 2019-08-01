const { format, addDays, subDays } = require('date-fns')
const { get } = require('lodash')

const { getQueryString } = require('../../../common/lib/request')
const permissions = require('../../../common/middleware/permissions')
const presenters = require('../../../common/presenters')

module.exports = function list(req, res) {
  const { moveDate, movesByDate } = res.locals
  const today = format(new Date(), 'YYYY-MM-DD')
  const previousDay = format(subDays(moveDate, 1), 'YYYY-MM-DD')
  const nextDay = format(addDays(moveDate, 1), 'YYYY-MM-DD')
  const canViewMove = permissions.check(
    'move:view',
    get(req.session, 'user.permissions')
  )
  const template = canViewMove ? 'moves/views/list' : 'moves/views/download'
  const locals = {
    pageTitle: 'moves::dashboard.upcoming_moves',
    destinations: presenters.movesByToLocation(movesByDate),
    pagination: {
      todayUrl: getQueryString(req.query, {
        'move-date': today,
      }),
      nextUrl: getQueryString(req.query, {
        'move-date': nextDay,
      }),
      prevUrl: getQueryString(req.query, {
        'move-date': previousDay,
      }),
    },
  }

  res.render(template, locals)
}
