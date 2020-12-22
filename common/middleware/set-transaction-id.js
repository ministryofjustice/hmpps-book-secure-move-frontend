const uuid = require('uuid')

const setTransactionId = (req, res, next) => {
  req.transactionId = req.get('x-request-id') || uuid.v4()
  next()
}

module.exports = setTransactionId
