const getMoveSummary = require('../helpers/move/get-move-summary')

function setMoveSummaryWithSessionData(req, res, next) {
  const currentLocation = req.session.currentLocation
  const sessionData = req.sessionModel.toJSON()

  res.locals = {
    ...res.locals,
    ...getMoveSummary({
      ...req.move,
      ...sessionData,
      from_location: req.move?.from_location || currentLocation,
    }),
  }

  next()
}

module.exports = setMoveSummaryWithSessionData
