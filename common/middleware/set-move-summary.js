const getMoveSummary = require('../helpers/move/get-move-summary')

function setMoveSummary(req, res, next) {
  res.locals = {
    ...getMoveSummary(req.move),
    ...res.locals,
  }

  next()
}

module.exports = setMoveSummary
