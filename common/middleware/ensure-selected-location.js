const pathToRegexp = require('path-to-regexp')

function ensureSelectedLocation({ locationsMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    const matchedWhitelists = whitelist.filter(route =>
      pathToRegexp.match(route)(req.url)
    )

    if (
      req.session.hasSelectedLocation ||
      matchedWhitelists.length > 0 ||
      req.url.includes(locationsMountpath)
    ) {
      return next()
    }

    req.session.originalRequestUrl = req.originalUrl
    res.redirect(locationsMountpath)
  }
}

module.exports = ensureSelectedLocation
