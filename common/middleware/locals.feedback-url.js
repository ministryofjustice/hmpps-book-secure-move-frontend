const { FEEDBACK_URL } = require('../../config')

module.exports = function (req, res, next) {
  res.locals.FEEDBACK_URL = FEEDBACK_URL
  next()
}
