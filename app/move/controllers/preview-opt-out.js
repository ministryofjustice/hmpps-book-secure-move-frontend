const Sentry = require('@sentry/node')

const { sendEvent } = require('../../../common/lib/analytics')
const { COOKIES } = require('../../../config')

async function previewOptOut(req, res) {
  const moveId = req.query.move_id
  const cookieName = COOKIES.MOVE_DESIGN_PREVIEW.name(req.user.userId)

  res.cookie(cookieName, 0, {
    maxAge: COOKIES.MOVE_DESIGN_PREVIEW.maxAge,
  })

  try {
    await sendEvent({
      category: 'Move Design Preview',
      action: 'Opt out',
      label: req.currentLocation?.location_type,
    })
  } catch (e) {
    Sentry.captureException(e)
  }

  if (moveId) {
    return res.redirect(`/move/${moveId}`)
  }

  res.redirect('/')
}

module.exports = previewOptOut
