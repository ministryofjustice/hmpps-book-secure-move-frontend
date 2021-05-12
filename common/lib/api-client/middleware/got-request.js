const Sentry = require('@sentry/node')
const HttpAgent = require('agentkeepalive')
const debug = require('debug')('app:api-client:request')
const cacheDebug = require('debug')('app:api-client:cache')
const got = require('got')

const cache = require('../cache')
const clientMetrics = require('../client-metrics')

const { HttpsAgent } = HttpAgent

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

      const response = await got({
        ...req,
        agent: {
          http: new HttpAgent(),
          https: new HttpsAgent(),
        },
        timeout,
      })
        .then(async res => {
          debug(
            `[${res.statusCode}] ${res.statusMessage}`,
            `(${req.method} ${url})`
          )

          // record successful request
          if (res.timings) {
            const duration = (res.timings.end - res.timings.start) / 1000
            clientMetrics.recordSuccess(req, res, duration)
          }

          if (cacheKey) {
            cacheDebug('SAVING', cacheKey, res.body)
            await cache.set(cacheKey, res.body, cacheExpiry, useRedisCache)
          }

          return res
        })
        .catch(error => {
          const { requestUrl, statusCode, statusMessage, timings } =
            error.response || error.request || {}

          const text = statusMessage || error.message
          const status = error.code === 'ETIMEDOUT' ? 408 : statusCode || 500

          debug(`[${status}] ${text}`, `(${req.method} ${url})`, error)

          // record error
          if (timings) {
            const duration =
              ((timings.error || timings.end) - timings.start) / 1000
            clientMetrics.recordError(req, error, duration)
          }

          Sentry.addBreadcrumb({
            type: 'http',
            category: 'http',
            data: {
              method: req.method,
              url: requestUrl ? decodeURIComponent(requestUrl) : undefined,
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
