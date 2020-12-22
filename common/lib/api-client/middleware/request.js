const debug = require('debug')('app:api-client:request')
const cacheDebug = require('debug')('app:api-client:cache')

const timer = require('../../timer')
const cache = require('../cache')
const clientMetrics = require('../client-metrics')

function requestMiddleware({ cacheExpiry = 60, useRedisCache = false } = {}) {
  return {
    name: 'app-request',
    req: async function req(payload) {
      if (payload.res) {
        return payload.res
      }

      const { req, jsonApi, cacheKey } = payload
      const urlObj = new URL(req.url)
      const searchString = new URLSearchParams(req.params).toString()
      const url = decodeURI(
        `${urlObj.pathname}${searchString ? `?${searchString}` : ''}`
      )

      debug(req.method, url)

      if (req.params.preserveResourceRefs) {
        req.preserveResourceRefs = req.params.preserveResourceRefs
        delete req.params.preserveResourceRefs
      }

      // start timer for metrics and logging
      const clientTimer = timer()

      const response = await jsonApi
        .axios(req)
        .then(async res => {
          debug(`${res.status} ${res.statusText}`, `(${req.method} ${url})`)

          // record successful request
          const duration = clientTimer()
          clientMetrics.recordSuccess(req, res, duration)

          if (cacheKey) {
            cacheDebug('SAVING', cacheKey, res.data)
            await cache.set(cacheKey, res.data, cacheExpiry, useRedisCache)
          }

          return res
        })
        .catch(error => {
          debug(
            `${error.response.status} ${error.response.statusText}`,
            `(${req.method} ${url})`,
            error
          )
          // record error
          const duration = clientTimer()
          clientMetrics.recordError(req, error, duration)

          throw error
        })

      response.req = req
      return response
    },
  }
}

module.exports = requestMiddleware
