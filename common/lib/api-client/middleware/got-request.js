const Sentry = require('@sentry/node')
const debug = require('debug')('app:api-client:request')
const cacheDebug = require('debug')('app:api-client:cache')
const got = require('got')

const timer = require('../../timer')
const cache = require('../cache')
const clientMetrics = require('../client-metrics')

function requestMiddleware({
  cacheExpiry = 60,
  useRedisCache = false,
  timeout,
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
      const searchString = new URLSearchParams(req.searchParams).toString()
      const url = decodeURI(
        `${urlObj.pathname}${searchString ? `?${searchString}` : ''}`
      )

      debug(`Got:${req.method}`, url)

      // start timer for metrics and logging
      const clientTimer = timer()

      const response = await got({ ...req, timeout })
        .then(async res => {
          debug(
            `[${res.statusCode}] ${res.statusMessage}`,
            `(${req.method} ${url})`
          )

          // record successful request
          const duration = clientTimer()
          clientMetrics.recordSuccess(req, res, duration)

          if (cacheKey) {
            cacheDebug('SAVING', cacheKey, res.body)
            await cache.set(cacheKey, res.body, cacheExpiry, useRedisCache)
          }

          return res
        })
        .catch(error => {
          const { response: errResponse = {} } = error
          const text = errResponse.statusMessage || error.message
          const status =
            error.code === 'ECONNABORTED' ? 408 : errResponse.statusCode || 500

          debug(`[${status}] ${text}`, `(${req.method} ${url})`, error)

          // record error
          const duration = clientTimer()
          clientMetrics.recordError(req, error, duration)

          Sentry.addBreadcrumb({
            type: 'http',
            category: 'http',
            data: {
              method: req.method,
              url: errResponse.requestUrl
                ? decodeURIComponent(errResponse.requestUrl)
                : undefined,
              status_code: status,
            },
            level: Sentry.Severity.Info,
          })

          throw error
        })

      response.req = req
      return response
    },
  }
}

module.exports = requestMiddleware
