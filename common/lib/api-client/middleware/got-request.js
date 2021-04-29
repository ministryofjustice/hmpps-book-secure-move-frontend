const Sentry = require('@sentry/node')
const debug = require('debug')('app:api-client:request')
const cacheDebug = require('debug')('app:api-client:cache')
const got = require('got')

const cache = require('../cache')
const clientMetrics = require('../client-metrics')

function requestMiddleware({
  cacheExpiry = 60,
  useRedisCache = false,
  timeout,
  cacheAdapter,
} = {}) {
  return {
    name: 'got-request',
    req: async function req(payload) {
      // If payload already contains a response, bypass and call next middleware
      // This usecase is currently for cached requests
      // TODO: Remove if we switch to Got cache API
      if (payload.res) {
        return payload.res
      }

      const { req, cacheKey } = payload
      const urlObj = new URL(req.url)
      const searchString = new URLSearchParams(req.params).toString()
      const url = decodeURI(
        `${urlObj.pathname}${searchString ? `?${searchString}` : ''}`
      )

      // let testResponse = await got('https://sindresorhus.com', {
      //   cache: cacheAdapter,
      // })
      // console.log(testResponse.isFromCache)

      // testResponse = await got('https://sindresorhus.com', {
      //   cache: cacheAdapter,
      // })
      // console.log(testResponse.isFromCache)

      debug(req.method, url)

      const response = await await got.paginate
        .all({ ...req, cache: cacheAdapter, timeout })
        .then(async res => {
          debug(
            `[${res.statusCode}] ${res.statusMessage}`,
            `(${req.method} ${url})`
          )

          // record successful request
          const duration = (res.timings?.end - res.timings?.start) / 1000
          clientMetrics.recordSuccess(req, res, duration)

          //   // if (cacheKey) {
          //   //   cacheDebug('SAVING', cacheKey, res.body)
          //   //   await cache.set(cacheKey, res.body, cacheExpiry, useRedisCache)
          //   // }

          return res
        })
        .catch(error => {
          const { response: errResponse = {}, request: errRequest = {} } = error
          const message = errResponse.statusMessage || error.message
          const status =
            error.code === 'ECONNABORTED' ? 408 : errResponse.statusCode || 500

          debug(`[${status}] ${message}`, `(${req.method} ${url})`, error)

          // record error
          const duration =
            (errResponse.timings?.end - errResponse.timings?.start) / 1000
          clientMetrics.recordError(req, error, duration)

          Sentry.addBreadcrumb({
            type: 'http',
            category: 'http',
            data: {
              method: req.method,
              url: errRequest.requestUrl
                ? decodeURIComponent(errRequest.requestUrl)
                : undefined,
              status_code: status,
            },
            level: Sentry.Severity.Info,
          })

          throw error
        })

      // console.log(response.isFromCache, url)

      response.req = req
      return response
    },
  }
}

module.exports = requestMiddleware
