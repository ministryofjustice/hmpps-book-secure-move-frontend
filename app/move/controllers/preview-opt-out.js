const { COOKIES } = require('../../../config')

function previewOptOut(req, res) {
  const moveId = req.query.move_id
  const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user.userId)

  res.cookie(cookieName, 0, {
    maxAge: COOKIES.MOVE_DESIGN_PREVIEW.maxAge,
  })

  if (moveId) {
    return res.redirect(`/move/${moveId}`)
  }

  res.redirect('/')
}

module.exports = previewOptOut
