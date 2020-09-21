const Sentry = require('@sentry/node')

module.exports = function sentryEnrichScope(req, res, next) {
  const { currentLocation } = req.session

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
