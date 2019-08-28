function ensureCurrentLocation({ locationsMountpath, whitelist = [] } = {}) {
  return (req, res, next) => {
    const { permissions = [], locations = [] } = req.session.user || {}
    const canViewAllMovesWithoutLocations =
      permissions.includes('moves:view:all') && !locations.length

    if (
      req.session.currentLocation ||
      whitelist.includes(req.url) ||
      req.url.includes(locationsMountpath) ||
      canViewAllMovesWithoutLocations
    ) {
      return next()
    }

    res.redirect(locationsMountpath)
  }
}

module.exports = ensureCurrentLocation
