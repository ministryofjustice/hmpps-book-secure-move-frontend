function ensureSelectedLocation({ locationsMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    if (
      req.session.hasSelectedLocation ||
      whitelist.includes(req.url) ||
      req.url.includes(locationsMountpath)
    ) {
      return next()
    }

    req.session.originalRequestUrl = req.originalUrl
    res.redirect(locationsMountpath)
  }
}

module.exports = ensureSelectedLocation
