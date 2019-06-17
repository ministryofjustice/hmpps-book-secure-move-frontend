const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../../config')
const { devourAuthMiddleware } = require('./auth')
const defineModels = require('./models')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

jsonApi.insertMiddlewareBefore('axios-request', devourAuthMiddleware)

defineModels(jsonApi)

module.exports = jsonApi
