const dateHelpers = require('../../common/helpers/date-utils')

function setDateRange(req, res, next, date) {
  const { period } = req.params
  const dateRange = dateHelpers.getDateRange(date, period)

  if (!dateRange[0] && !dateRange[1]) {
    const error = new Error('Invalid date')
    error.statusCode = 404

    return next(error)
  }

  req.params.dateRange = dateRange

  next()
}

module.exports = setDateRange
