const Sentry = require('@sentry/node')

module.exports = function sentryEnrichScope(req, res, next) {
  const { currentLocation, user } = req.session

  if (currentLocation) {
    const {
      key: locationKey = '',
      location_type: locationType,
    } = currentLocation

    Sentry.setTag('location.key', locationKey.toUpperCase())
    Sentry.setTag('location.type', locationType)

    Sentry.setContext('location', {
      key: locationKey.toUpperCase(),
      location_type: locationType,
    })
  }

  if (user) {
    Sentry.setUser({
      id: user.userId,
    })
  }

  next()
}
