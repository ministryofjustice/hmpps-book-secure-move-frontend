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

  // TODO: Move these to the controller to move away
  // from setting `res.locals` in middleware
  res.locals.dateRange = dateRange
  res.locals.period = period

  next()
}

module.exports = setDateRange
