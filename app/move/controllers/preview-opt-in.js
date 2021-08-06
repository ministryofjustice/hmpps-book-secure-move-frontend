const { COOKIES } = require('../../../config')
const { PREVIEW_PREFIX } = require('../app/view/constants')

function previewOptIn(req, res) {
  const moveId = req.query.move_id
  const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user.userId)

  res.cookie(cookieName, 1, {
    maxAge: COOKIES.MOVE_DESIGN_PREVIEW.maxAge,
  })

  if (moveId) {
    return res.redirect(`/move${PREVIEW_PREFIX}/${moveId}`)
  }

  res.redirect('/')
}

module.exports = previewOptIn
