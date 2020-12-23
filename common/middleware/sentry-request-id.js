const Sentry = require('@sentry/node')

module.exports = function sentryRequestId(req, res, next) {
  const requestId = req.get('x-request-id')
  // This is defined in a previous middleware and uses the x-request-id if available
  const transactionId = req.transactionId

  if (requestId) {
    Sentry.setTag('request_id', requestId)
  }

  if (transactionId) {
    Sentry.setTag('transaction_id', transactionId)
  }

  next()
}
