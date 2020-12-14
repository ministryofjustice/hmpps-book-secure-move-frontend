const ApiClient = require('../lib/api-client')

class BaseService {
  constructor(req) {
    this.apiClient = (req && req.apiClient) || new ApiClient()
  }
}

module.exports = BaseService
