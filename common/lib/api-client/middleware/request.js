const debug = require('debug')('app:api-client:axios-request')

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
      const searchString = new URLSearchParams(req.params).toString()
      const url = `${req.url}${searchString ? `?${searchString}` : ''}`

      debug('API REQUEST', url)

      if (req.params.preserveResourceRefs) {
        req.preserveResourceRefs = req.params.preserveResourceRefs
        delete req.params.preserveResourceRefs
      }

      // start timer for metrics and logging
      const clientTimer = timer()

      const response = await jsonApi
        .axios(req)
        .then(async res => {
          debug('API SUCCESS', url)
          // record successful request
          const duration = clientTimer()
          clientMetrics.recordSuccess(req, res, duration)

          if (cacheKey) {
            debug('CACHEING API RESPONSE', cacheKey)
            await cache.set(cacheKey, res.data, cacheExpiry, useRedisCache)
          }

          return res
        })
        .catch(error => {
          debug('API ERROR', url, error)
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
