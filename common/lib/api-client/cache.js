const LRU = require('lru-cache')

const redisStore = require('../../../config/redis-store')

const lruCache = new LRU({ max: 1000 })

async function get(key, useRedisCache = false) {
  let data

  if (useRedisCache) {
    data = await (await redisStore()).client.getAsync(key)
  } else {
    data = lruCache.get(key)
  }

  if (typeof data === 'string') {
    data = JSON.parse(data)
  }

  return data
}

async function set(key, data = {}, expiry, useRedisCache) {
  if (useRedisCache) {
    const stringifiedData = JSON.stringify(data)
    await (await redisStore()).client.setexAsync(key, expiry, stringifiedData)
  } else {
    lruCache.set(key, data, expiry)
  }
}

module.exports = {
  get,
  set,
}
