const { isUndefined } = require('lodash')

function ensureCurrentLocation({ locationsMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    if (
      !isUndefined(req.session.currentLocation) ||
      whitelist.includes(req.url) ||
      req.url.includes(locationsMountpath)
    ) {
      return next()
    }

    res.redirect(locationsMountpath)
  }
}

module.exports = ensureCurrentLocation
