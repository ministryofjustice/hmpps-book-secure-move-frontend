const debug = require('debug')('app:api-client')
const { get } = require('lodash')

const { API } = require('../../../../config')
const redisStore = require('../../../../config/redis-store')
const models = require('../models')

const inMemoryCache = {}

function getCacheResponse(key, useRedisCache) {
  if (useRedisCache) {
    return redisStore().client.getAsync(key)
  } else {
    return Promise.resolve(inMemoryCache[key])
  }
}

async function setCacheResponse(response, key, expiry, useRedisCache) {
  const data = JSON.stringify(response.data)

  if (useRedisCache) {
    await redisStore().client.setexAsync(key, expiry, data)
  } else {
    inMemoryCache[key] = data
  }

  return response
}

function requestMiddleware({ cacheExpiry = 60, useRedisCache = false } = {}) {
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

      return getCacheResponse(key, useRedisCache).then(response => {
        if (!response) {
          debug('CACHED (first hit)', key)
          return jsonApi
            .axios(req)
            .then(response =>
              setCacheResponse(response, key, cacheExpiry, useRedisCache)
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
