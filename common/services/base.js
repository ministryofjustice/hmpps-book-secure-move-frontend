const { isObject, isString, isNil, isEmpty, omitBy } = require('lodash')

const ApiClient = require('../lib/api-client')

class BaseService {
  constructor(req) {
    this.req = req || {}
    this.apiClient = (req && req.apiClient) || new ApiClient()
  }

  removeInvalid(input) {
    return omitBy(input, v =>
      isObject(v) || isString(v) ? isEmpty(v) : isNil(v)
    )
  }
}

module.exports = BaseService
