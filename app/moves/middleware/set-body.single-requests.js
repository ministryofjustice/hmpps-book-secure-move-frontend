function setBodySingleRequests(req, res, next) {
  const { status } = req.query
  const { dateRange, locationId } = req.params

  req.body = {
    status,
    createdAtDate: dateRange,
    fromLocationId: locationId,
  }

  next()
}

module.exports = setBodySingleRequests
