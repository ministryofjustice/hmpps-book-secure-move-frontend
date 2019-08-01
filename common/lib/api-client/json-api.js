const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../../config')
const { errors } = require('./middleware')
const { devourAuthMiddleware } = require('./middleware/auth')
const defineModels = require('./models')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

jsonApi.replaceMiddleware('errors', errors)
jsonApi.insertMiddlewareBefore('axios-request', devourAuthMiddleware)

defineModels(jsonApi)

module.exports = jsonApi
