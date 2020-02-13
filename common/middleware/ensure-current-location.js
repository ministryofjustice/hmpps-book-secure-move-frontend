const { isUndefined } = require('lodash')

function ensureCurrentLocation({
  locationsMountpath,
  ocaMountpath,
  whitelist = [],
} = {}) {
  return (req, res, next) => {
    if (
      !isUndefined(req.session.currentLocation) ||
      whitelist.includes(req.url) ||
      req.url.includes(locationsMountpath) ||
      req.url.includes(ocaMountpath)
    ) {
      return next()
    }
    if (res.locals && res.locals.USER && res.locals.USER.role === 'OCA') {
      req.session.originalRequestUrl = req.originalUrl
      return res.redirect(ocaMountpath)
    }
    req.session.originalRequestUrl = req.originalUrl
    res.redirect(locationsMountpath)
  }
}

module.exports = ensureCurrentLocation
