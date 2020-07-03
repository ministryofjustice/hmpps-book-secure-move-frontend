const debug = require('debug')('app:api-client')
const { get } = require('lodash')

const { API } = require('../../../../config')
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

      const searchString = new URLSearchParams(req.params).toString()
      const key = `cache:v${API.VERSION}:${req.method}.${pathname}${
        searchString ? `?${searchString}` : ''
      }`
      const cacheModel = get(models, `${req.model}.options.cache`)

      if (!cacheModel || req.params.cache === false || disableCache) {
        debug('NO CACHE', key)
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
