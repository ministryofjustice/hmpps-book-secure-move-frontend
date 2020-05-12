const { get, isUndefined } = require('lodash')

const permissions = require('./permissions')

function ensureCurrentLocation({ locationsMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    const userCanViewAllocations = permissions.check(
      'allocations:view',
      get(req.session, 'user.permissions')
    )

    if (
      !isUndefined(req.session.currentLocation) ||
      whitelist.includes(req.url) ||
      req.url.includes(locationsMountpath) ||
      userCanViewAllocations
    ) {
      return next()
    }

    req.session.originalRequestUrl = req.originalUrl
    res.redirect(locationsMountpath)
  }
}

module.exports = ensureCurrentLocation
