function setBodySingleRequests(req, res, next) {
  const { locationId } = req.params
  const { dateRange } = res.locals
  const { status } = req.query

  req.body = {
    status,
    createdAtDate: dateRange,
    fromLocationId: locationId,
  }

  next()
}

module.exports = setBodySingleRequests
