const debug = require('debug')('app:api-client:cache')

const cache = require('../cache')

function getCacheMiddleware({ useRedisCache = false } = {}) {
  return {
    name: 'get-cache',
    req: async function req(payload) {
      const { cacheKey } = payload

      if (!cacheKey) {
        return payload
      }

      debug('SEARCHING', cacheKey)
      const body = await cache.get(cacheKey, useRedisCache)

      if (body) {
        debug('RETURNING', cacheKey, body)
        payload.res = {
          body,
        }
      }

      return payload
    },
  }
}

module.exports = getCacheMiddleware
