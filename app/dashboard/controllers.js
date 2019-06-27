const {
  format,
  addDays,
  subDays,
} = require('date-fns')

const { getQueryString } = require('../../common/lib/request')
const presenters = require('../../common/presenters')
const moveService = require('../../common/services/move')

module.exports = {
  get: async (req, res, next) => {
    try {
      const moveDate = req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')
      const response = await moveService.getRequestedMovesByDate(moveDate)
      const yesterday = format(subDays(moveDate, 1), 'YYYY-MM-DD')
      const tomorrow = format(addDays(moveDate, 1), 'YYYY-MM-DD')
      const locals = {
        moveDate,
        pageTitle: 'dashboard.upcoming_moves',
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
