const debug = require('debug')('app:api-client:axios-request')

const cache = require('../cache')

function requestMiddleware({ cacheExpiry = 60, useRedisCache = false } = {}) {
  return {
    name: 'axios-request',
    req: async function req(payload) {
      if (payload.res) {
        return payload.res
      }

      const { req, jsonApi, cacheKey } = payload

      debug('API REQUEST', req.url)

      const response = await jsonApi
        .axios(req)
        .then(async response => {
          if (cacheKey) {
            debug('CACHEING API RESPONSE', cacheKey)
            await cache.set(cacheKey, response.data, cacheExpiry, useRedisCache)
          }

          return response
        })
        .catch(error => {
          debug('API ERROR', req.url, error)
          throw error
        })

      return response
    },
  }
}

module.exports = requestMiddleware
