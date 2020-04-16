function setDatePeriod(req, res, next, period) {
  res.locals.period = period
  next()
}

module.exports = setDatePeriod
