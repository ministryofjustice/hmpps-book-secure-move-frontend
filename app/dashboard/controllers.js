const {
  format,
  addDays,
  subDays,
} = require('date-fns')

const { getQueryString } = require('../../common/lib/request')
const mappers = require('../../common/mappers')
const api = require('../../common/lib/api-client')

module.exports = {
  get: async (req, res, next) => {
    try {
      const moveDate = req.query['move-date'] || format(new Date(), 'YYYY-MM-DD')
      const moves = await api.getMovesByDate(moveDate)
      const yesterday = format(subDays(moveDate, 1), 'YYYY-MM-DD')
      const tomorrow = format(addDays(moveDate, 1), 'YYYY-MM-DD')
      const params = {
        moveDate,
        moves: moves.data.map(mappers.moveToCardComponent),
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
    } catch (error) {
      next(error)
    }
  },
}
