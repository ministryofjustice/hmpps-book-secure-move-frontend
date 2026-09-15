const Sentry = require('@sentry/node')

module.exports = function sentryEnrichScope(req, res, next) {
  if (req.user) {
    Sentry.setUser({
      id: req.user.userId,
      username: req.user.username,
      permissions: req.user.permissions,
    })
  }

  const currentLocation = req.location || req.session.currentLocation

  if (currentLocation) {
    const {
      title,
      key: locationKey = '',
      location_type: locationType,
    } = currentLocation

    Sentry.setTag('location.key', locationKey.toUpperCase())
    Sentry.setTag('location.type', locationType)

    Sentry.setContext('location', {
      name: title,
      key: locationKey.toUpperCase(),
      location_type: locationType,
    })
  }

  next()
}
