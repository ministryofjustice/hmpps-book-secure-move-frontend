const JsonApi = require('devour-client')

const { API, FILE_UPLOADS, FEATURE_FLAGS } = require('../../../config')

const {
  auth,
  cacheKey,
  errors,
  getCache,
  gotErrors,
  gotRequest,
  gotRequestTransformer,
  gotResponse,
  post,
  request,
  requestHeaders,
  requestInclude,
  requestTimeout,
} = require('./middleware')
const models = require('./models')

let requestMiddleware = request
let requestMiddlewareName = 'app-request'

if (FEATURE_FLAGS.GOT) {
  requestMiddleware = gotRequest
  requestMiddlewareName = 'got-request'
}

module.exports = function (req) {
  const instance = new JsonApi({
    apiUrl: API.BASE_URL,
    logger: false,
  })

  instance.replaceMiddleware('errors', FEATURE_FLAGS.GOT ? gotErrors : errors)

  if (FEATURE_FLAGS.GOT) {
    instance.replaceMiddleware('response', gotResponse)
  }

  instance.replaceMiddleware('POST', post(FILE_UPLOADS.MAX_FILE_SIZE))
  instance.replaceMiddleware(
    'axios-request',
    requestMiddleware({
      cacheExpiry: API.CACHE_EXPIRY,
      useRedisCache: API.USE_REDIS_CACHE,
      timeout: API.TIMEOUT,
    })
  )

  const insertRequestMiddleware = middleware => {
    instance.insertMiddlewareBefore(requestMiddlewareName, middleware)
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

  insertRequestMiddleware(requestHeaders(req))
  insertRequestMiddleware(requestInclude)
  insertRequestMiddleware(
    FEATURE_FLAGS.GOT ? gotRequestTransformer : requestTimeout(API.TIMEOUT)
  )

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.fields, model.options)
  })

  return instance
}
