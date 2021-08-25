const {
  COOKIES,
  FEEDBACK_URL,
  MOVE_DESIGN_FEEDBACK_URL,
} = require('../../config')

module.exports = function (req, res, next) {
  let feedbackUrl = FEEDBACK_URL

  if (MOVE_DESIGN_FEEDBACK_URL) {
    const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user.userId)

    if (req.cookies[cookieName] === '1') {
      feedbackUrl = MOVE_DESIGN_FEEDBACK_URL
    }
  }

  res.locals.FEEDBACK_URL = feedbackUrl

  next()
}
