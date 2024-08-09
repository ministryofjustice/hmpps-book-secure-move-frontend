import got from 'got'

const Sentry = require('@sentry/node')
const HttpAgent = require('agentkeepalive')
const debug = require('debug')('app:api-client:request')
const cacheDebug = require('debug')('app:api-client:cache')

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
        retry: {
          limit: 1,
          methods: ['GET'],
          statusCodes: [502, 504],
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
          const { statusCode, statusMessage, timings } =
            error.response || error.request || {}

          const text = statusMessage || error.message
          const status = error.code === 'ETIMEDOUT' ? 408 : statusCode || 500

          debug(`[${status}] ${text}`, `(${req.method} ${url})`, error)

          // TODO: Remove once we've figured out what timing is missing
          Sentry.setContext('Timings', {
            request: error.request ? error.request.timings : {},
            response: error.response ? error.response.timings : {},
          })

          // record error
          if (timings) {
            const timingEnd = timings.error || timings.end

            if (timingEnd) {
              const duration = (timingEnd - timings.start) / 1000
              clientMetrics.recordError(req, error, duration)
            }
          }

          error.statusCode = status

          throw error
        })

      response.req = req
      return response
    },
  }
}

module.exports = requestMiddleware
