const JsonApi = require('devour-client')

const { API, IS_DEV } = require('../../../config')
const { errors, requestTimeout } = require('./middleware')
const { devourAuthMiddleware } = require('./middleware/auth')
const models = require('./models')

let instance

module.exports = function() {
  if (instance) {
    return instance
  }

  instance = new JsonApi({
    apiUrl: API.BASE_URL,
    logger: IS_DEV,
  })

  instance.replaceMiddleware('errors', errors)
  instance.insertMiddlewareBefore('axios-request', requestTimeout(API.TIMEOUT))
  instance.insertMiddlewareBefore('axios-request', devourAuthMiddleware)

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.attributes, model.options)
  })

  return instance
}
