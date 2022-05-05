const bluebird = require('bluebird')
const RedisStore = require('connect-redis')(require('express-session'))
const retryStrategy = require('node-redis-retry-strategy')
const redis = require('redis')

const logger = require('./logger')

const { REDIS } = require('./')

const defaultOptions = {
  ...REDIS.SESSION,
  logErrors: logger.error,
  retry_strategy: retryStrategy(),
}

let store

module.exports = async function redisStore(options = defaultOptions) {
  if (store) {
    return store
  }

  const client = redis.createClient({ ...options, legacyMode: true })
  await client.connect()
  bluebird.promisifyAll(client)

  store = new RedisStore({ client })

  return store
}
