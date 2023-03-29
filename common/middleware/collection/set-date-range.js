const dateHelpers = require('../../helpers/date')

function setDateRange(req, res, next, date) {
  const { period } = req.params
  const dateRange = dateHelpers.getDateRange(date, period)
  req.session.viewDate = date

  if (!dateRange[0] && !dateRange[1]) {
    const error = new Error('Invalid date')
    error.statusCode = 404

    return next(error)
  }

  req.params.dateRange = dateRange
  req.dateRange = dateRange // https://github.com/expressjs/express/issues/2911

  next()
}

module.exports = setDateRange
