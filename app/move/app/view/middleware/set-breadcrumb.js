const i18n = require('../../../../../config/i18n')
const movesApp = require('../../../../moves')

function dashboardBreadcrumbTextContext(movesUrl) {
  if (movesUrl.includes('/outgoing')) {
    return 'outgoing_moves'
  } else if (movesUrl.includes('/incoming')) {
    return 'incoming_moves'
  } else if (movesUrl.includes('/requested')) {
    return 'single_requests'
  }
}

function setBreadcrumb(req, res, next) {
  const { profile, reference } = req.move || {}
  const name = profile?.person?._fullname
  const movesUrl = req.session?.movesUrl || movesApp.mountpath

  res.breadcrumb({
    text: i18n.t('collections::page_title', {
      context: dashboardBreadcrumbTextContext(movesUrl),
    }),
    href: movesUrl,
  })

  if (reference) {
    res.breadcrumb({
      text: name ? `${name} (${reference})` : reference,
      href: req.baseUrl,
    })
  }

  next()
}

module.exports = setBreadcrumb
