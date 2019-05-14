const {
  format,
  addDays,
  subDays,
} = require('date-fns')

const { getQueryString } = require('../../common/lib/request')

module.exports = {
  get: (req, res) => {
    const moveDate = req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')
    const yesterday = format(subDays(moveDate, 1), 'YYYY-MM-DD')
    const tomorrow = format(addDays(moveDate, 1), 'YYYY-MM-DD')
    const params = {
      moveDate,
      pageTitle: 'Upcoming moves',
      pagination: {
        nextUrl: getQueryString(req.query, {
          'move-date': tomorrow,
        }),
        prevUrl: getQueryString(req.query, {
          'move-date': yesterday,
        }),
      },
    }

    res.render('dashboard/dashboard', params)
  },
}
