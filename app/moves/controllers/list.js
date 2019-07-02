const {
  format,
  addDays,
  subDays,
} = require('date-fns')

const { getQueryString } = require('../../../common/lib/request')
const presenters = require('../../../common/presenters')

module.exports = function list (req, res) {
  const { moveDate, movesByDate } = res.locals
  const yesterday = format(subDays(moveDate, 1), 'YYYY-MM-DD')
  const tomorrow = format(addDays(moveDate, 1), 'YYYY-MM-DD')
  const locals = {
    pageTitle: 'moves:dashboard.upcoming_moves',
    destinations: presenters.movesByToLocation(movesByDate),
    pagination: {
      nextUrl: getQueryString(req.query, {
        'move-date': tomorrow,
      }),
      prevUrl: getQueryString(req.query, {
        'move-date': yesterday,
      }),
    },
  }

  res.render('moves/views/list', locals)
}
