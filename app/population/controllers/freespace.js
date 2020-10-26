const dateHelpers = require('../../../common/helpers/date')

function freespace(req, res) {
  const currentWeek = dateHelpers.getCurrentWeekAsRange()
  const today = new Date().toISOString()

  res.render('population/view/freespace', {
    pageTitle: 'population::freespace.title',

    currentWeek,
    today,
  })
}

module.exports = freespace
