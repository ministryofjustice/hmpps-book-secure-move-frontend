const debug = require('debug')('app:api-client')
const { get } = require('lodash')

const { API } = require('../../../../config')
const redisStore = require('../../../../config/redis-store')
const models = require('../models')

const inMemoryCache = {}

function getCacheResponse(key, disableCache) {
  if (disableCache) {
    return Promise.resolve(inMemoryCache[key])
  } else {
    return redisStore().client.getAsync(key)
  }
}

async function setCacheResponse(response, key, expiry, inMemory) {
  const data = JSON.stringify(response.data)

  if (inMemory) {
    inMemoryCache[key] = data
  } else {
    await redisStore().client.setexAsync(key, expiry, data)
  }

  return response
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

      if (!cacheModel || req.params.cache === false) {
        debug('NO CACHE', key)
        return jsonApi.axios(req)
      }

      return getCacheResponse(key, disableCache).then(response => {
        if (!response) {
          debug('CACHED (first hit)', key)
          return jsonApi
            .axios(req)
            .then(response =>
              setCacheResponse(response, key, cacheExpiry, disableCache)
            )
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
