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
      const data = await cache.get(cacheKey, useRedisCache)

      if (data) {
        debug('RETURNING', cacheKey, data)
        payload.res = {
          data,
        }
      }

      return payload
    },
  }
}

module.exports = getCacheMiddleware
