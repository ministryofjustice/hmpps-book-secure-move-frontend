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
  processResponse,
} = require('./middleware')
const models = require('./models')

let instance

module.exports = function (req) {
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
    instance.insertMiddlewareBefore('app-request', middleware)
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
  insertRequestMiddleware(requestHeaders(req))
  insertRequestMiddleware(requestInclude)

  instance.insertMiddlewareAfter('app-request', processResponse)

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.fields, model.options)
  })

  return instance
}
