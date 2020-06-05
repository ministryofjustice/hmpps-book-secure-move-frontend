const debug = require('debug')('app:api-client')
const { get } = require('lodash')
const uuid = require('uuid')

const redisStore = require('../../../../config/redis-store')
const models = require('../models')

function cacheResponse(key, expiry) {
  return async response => {
    await redisStore().client.setexAsync(
      key,
      expiry,
      JSON.stringify(response.data)
    )
    return response
  }
}

function requestMiddleware({ cacheExpiry = 60, disableCache = false } = {}) {
  return {
    name: 'axios-request',
    req: async function req(payload) {
      const { req, jsonApi } = payload
      const pathname = new URL(req.url).pathname

      if (Array.isArray(req.params.include)) {
        req.params.include = req.params.include.sort().join(',')
      }

      if (!req.params.include) {
        delete req.params.include
      }

      const searchString = new URLSearchParams(req.params).toString()
      const key = `cache:${req.method}.${pathname}${
        searchString ? `?${searchString}` : ''
      }`
      const cacheModel = get(models, `${req.model}.options.cache`)

      if (!cacheModel || req.params.cache === false || disableCache) {
        debug('NO CACHE', key)

        req.headers = {
          ...req.headers,
          'Idempotency-Key': uuid.v4(),
        }
        return jsonApi.axios(req)
      }

      return redisStore()
        .client.getAsync(key)
        .then(response => {
          if (!response) {
            debug('CACHED (first hit)', key)
            return jsonApi.axios(req).then(cacheResponse(key, cacheExpiry))
          }

          debug('CACHED', key)
          return {
            data: JSON.parse(response),
          }
        })
    },
  }
}

module.exports = requestMiddleware
