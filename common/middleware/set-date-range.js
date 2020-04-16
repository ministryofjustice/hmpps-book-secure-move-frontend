const {
  getDateFromParams,
  getDateRange,
} = require('../../common/helpers/date-utils')

function setDateRange(req, res, next) {
  const { period } = req.params
  const date = getDateFromParams(req)
  if (!date) {
    return res.redirect(req.baseUrl)
  }
  res.locals.dateRange = getDateRange(period, date)
  next()
}
module.exports = setDateRange
