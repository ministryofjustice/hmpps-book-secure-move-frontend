function allowGroupByVehicle(req, res, next) {
  res.locals.groupBySwitcher = true
  next()
}

module.exports = allowGroupByVehicle
