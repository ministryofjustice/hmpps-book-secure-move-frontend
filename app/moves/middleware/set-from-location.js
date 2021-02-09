function setFromLocation(req, res, next) {
  if (!req.location) {
    return next()
  }

  res.locals.fromLocationId = req.location?.id
  next()
}

module.exports = setFromLocation
