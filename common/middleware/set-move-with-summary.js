const moveHelpers = require('../helpers/move')

function setMoveWithSummary(req, res, next) {
  res.locals = {
    ...moveHelpers.getMoveWithSummary(req.move),
    ...res.locals,
  }
  next()
}

module.exports = setMoveWithSummary
