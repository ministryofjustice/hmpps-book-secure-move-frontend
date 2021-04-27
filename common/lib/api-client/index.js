const JsonApi = require('devour-client')

const { API, FILE_UPLOADS } = require('../../../config')

const {
  auth,
  cacheKey,
  getCache,
  gotErrors,
  gotRequest,
  gotRequestTransformer,
  gotResponse,
  post,
  requestHeaders,
  requestInclude,
} = require('./middleware')
const models = require('./models')

module.exports = function (req) {
  const instance = new JsonApi({
    apiUrl: API.BASE_URL,
    logger: false,
  })

  instance.replaceMiddleware('errors', gotErrors)
  instance.replaceMiddleware('response', gotResponse)
  instance.replaceMiddleware('POST', post(FILE_UPLOADS.MAX_FILE_SIZE))
  instance.replaceMiddleware(
    'axios-request',
    gotRequest({
      cacheExpiry: API.CACHE_EXPIRY,
      useRedisCache: API.USE_REDIS_CACHE,
      timeout: API.TIMEOUT,
    })
  )

  const insertRequestMiddleware = middleware => {
    instance.insertMiddlewareBefore('got-request', middleware)
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
  insertRequestMiddleware(gotRequestTransformer)

  // define models
  Object.entries(models).forEach(([modelName, model]) => {
    instance.define(modelName, model.fields, model.options)
  })

  return instance
}
