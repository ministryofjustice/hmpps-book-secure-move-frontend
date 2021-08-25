const Sentry = require('@sentry/node')

const { sendEvent } = require('../../../common/lib/analytics')
const { COOKIES } = require('../../../config')
const { PREVIEW_PREFIX } = require('../app/view/constants')

async function previewOptIn(req, res) {
  const moveId = req.query.move_id
  const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user.userId)

  res.cookie(cookieName, 1, {
    maxAge: COOKIES.MOVE_DESIGN_PREVIEW.maxAge,
  })

  try {
    await sendEvent({
      category: 'Move Design Preview',
      action: 'Opt in',
      label: req.currentLocation?.location_type,
    })
  } catch (e) {
    Sentry.captureException(e)
  }

  if (moveId) {
    return res.redirect(`/move${PREVIEW_PREFIX}/${moveId}`)
  }

  res.redirect('/')
}

module.exports = previewOptIn
