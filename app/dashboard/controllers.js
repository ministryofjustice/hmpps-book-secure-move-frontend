const {
  format,
  addDays,
  subDays,
} = require('date-fns')

const { getQueryString } = require('../../common/lib/request')
const presenters = require('../../common/presenters')
const api = require('../../common/lib/api-client')

module.exports = {
  get: async (req, res, next) => {
    try {
      const moveDate = req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')
      const response = await api.getMovesByDate(moveDate)
      const yesterday = format(subDays(moveDate, 1), 'YYYY-MM-DD')
      const tomorrow = format(addDays(moveDate, 1), 'YYYY-MM-DD')
      const locals = {
        moveDate,
        pageTitle: 'Upcoming moves',
        destinations: presenters.movesByToLocation(response.data),
        pagination: {
          nextUrl: getQueryString(req.query, {
            'move-date': tomorrow,
          }),
          prevUrl: getQueryString(req.query, {
            'move-date': yesterday,
          }),
        },
      }

      res.render('dashboard/dashboard', locals)
    } catch (error) {
      next(error)
    }
  },
}
