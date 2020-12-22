const Sentry = require('@sentry/node')

module.exports = function sentryRequestId(req, res, next) {
  // This is defined in a previous middleware and uses the x-request-id if available
  const transactionId = req.transactionId

  if (transactionId) {
    Sentry.setTag('request_id', transactionId)
    Sentry.setTag('transaction_id', transactionId)
  }

  next()
}
