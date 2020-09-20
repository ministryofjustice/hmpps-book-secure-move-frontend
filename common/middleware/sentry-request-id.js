const Sentry = require('@sentry/node')

module.exports = function sentryRequestId(req, res, next) {
  const requestId = req.headers['x-request-id']

  if (requestId) {
    Sentry.setTag('request_id', requestId)
  }

  next()
}
