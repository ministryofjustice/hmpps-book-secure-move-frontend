const JsonApi = require('devour-client')

const { API, IS_DEV, FILE_UPLOADS } = require('../../../config')

const {
  auth,
  errors,
  post,
  request,
  requestInclude,
  requestTimeout,
} = require('./middleware')
const models = require('./models')

let instance

module.exports = function () {
  if (instance) {
    return instance
  }

  instance = new JsonApi({
    apiUrl: API.BASE_URL,
    logger: IS_DEV,
  })

  instance.replaceMiddleware('errors', errors)
  instance.replaceMiddleware('POST', post(FILE_UPLOADS.MAX_FILE_SIZE))
  instance.replaceMiddleware(
    'axios-request',
    request({
      cacheExpiry: API.CACHE_EXPIRY,
      disableCache: API.DISABLE_CACHE,
    })
  )
  instance.insertMiddlewareBefore('axios-request', requestTimeout(API.TIMEOUT))
  instance.insertMiddlewareBefore('axios-request', requestInclude)
  instance.insertMiddlewareBefore('axios-request', auth)

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.fields, model.options)
  })

  return instance
}
