const { COOKIES } = require('../../config')

module.exports = function (req, res, next) {
  const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user?.userId)
  req.moveDesignPreview = req.cookies[cookieName] === '1'
  next()
}
