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
        const response = await jsonApi.axios(req)
        const data = response.data
        console.log(JSON.stringify({ data }, null, 2))
        return response
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
