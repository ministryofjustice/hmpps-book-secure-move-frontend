import JsonApi from 'devour-client'

import { API, FEATURE_FLAGS, FILE_UPLOADS } from '../../../config'
import { BasmRequest } from '../../types/basm_request'
import { Middleware } from '../../types/middleware'

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

export class ApiClient extends JsonApi {
  constructor(req?: BasmRequest) {
    super({
      apiUrl: API.BASE_URL,
      logger: false,
    })

    this.replaceMiddleware('errors', FEATURE_FLAGS.GOT ? gotErrors : errors)

    if (FEATURE_FLAGS.GOT) {
      this.replaceMiddleware('response', gotResponse)
    }

    this.replaceMiddleware('POST', post(FILE_UPLOADS.MAX_FILE_SIZE))
    this.replaceMiddleware(
      'axios-request',
      requestMiddleware({
        cacheExpiry: API.CACHE_EXPIRY,
        useRedisCache: API.USE_REDIS_CACHE,
        timeout: API.TIMEOUT,
      })
    )

    const insertRequestMiddleware = (middleware: Middleware) => {
      this.insertMiddlewareBefore(requestMiddlewareName, middleware)
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
    // TODO: remove the below casting when models dir is converted
    Object.entries(
      models as { [modelName: string]: { fields: any; options: any } }
    ).forEach(([modelName, model]) => {
      this.define(modelName, model.fields, model.options)
    })
  }
}
