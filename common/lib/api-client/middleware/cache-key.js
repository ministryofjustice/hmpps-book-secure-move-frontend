const { get } = require('lodash')

const models = require('../models')

function cacheKeyMiddleware({ apiVersion = 2 } = {}) {
  return {
    name: 'cache-key',
    req: function req(payload) {
      const { req } = payload
      const cacheModel = get(models, `${req.model}.options.cache`)

      const tryCache = cacheModel && req.params.cache !== false

      if (tryCache) {
        const pathname = new URL(req.url).pathname

        const searchString = new URLSearchParams(req.params).toString()
        const key = `cache:v${apiVersion}:${req.method}.${pathname}${
          searchString ? `?${searchString}` : ''
        }`

        payload.cacheKey = key
      }

      return payload
    },
  }
}

module.exports = cacheKeyMiddleware
