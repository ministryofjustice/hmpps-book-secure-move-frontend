const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../../config')
const { errors, requestTimeout } = require('./middleware')
const { devourAuthMiddleware } = require('./middleware/auth')
const models = require('./models')

const jsonApi = new JsonApi({
  apiUrl: API.BASE_URL,
  logger: IS_DEV,
})

jsonApi.replaceMiddleware('errors', errors)
jsonApi.insertMiddlewareBefore('axios-request', requestTimeout(API.TIMEOUT))
jsonApi.insertMiddlewareBefore('axios-request', devourAuthMiddleware)

// define models
Object.entries(models).forEach(([modelName, model]) => {
  jsonApi.define(modelName, model.attributes, model.options)
})

module.exports = jsonApi
