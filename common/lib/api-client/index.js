const JsonApi = require('devour-client')

const { API, FILE_UPLOADS } = require('../../../config')

const {
  auth,
  errors,
  post,
  request,
  cacheKey,
  getCache,
  requestHeaders,
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
    logger: false,
  })

  instance.replaceMiddleware('errors', errors)
  instance.replaceMiddleware('POST', post(FILE_UPLOADS.MAX_FILE_SIZE))
  instance.replaceMiddleware(
    'axios-request',
    request({
      cacheExpiry: API.CACHE_EXPIRY,
      useRedisCache: API.USE_REDIS_CACHE,
    })
  )

  const insertRequestMiddleware = middleware => {
    instance.insertMiddlewareBefore('axios-request', middleware)
  }

  insertRequestMiddleware(cacheKey({ apiVersion: API.VERSION }))
  insertRequestMiddleware(
    getCache({
      useRedisCache: API.USE_REDIS_CACHE,
    })
  )

  if (API.CLIENT_ID && API.SECRET) {
    insertRequestMiddleware(auth)
  }

  insertRequestMiddleware(requestTimeout(API.TIMEOUT))
  insertRequestMiddleware(requestHeaders)
  insertRequestMiddleware(requestInclude)

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.fields, model.options)
  })

  return instance
}
