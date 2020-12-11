const apiClient = require('../lib/api-client')

const setApiClient = (req, res, next) => {
  req.apiClient = apiClient(req)

  next()
}

module.exports = setApiClient
