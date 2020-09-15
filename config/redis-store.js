const bluebird = require('bluebird')
const RedisStore = require('connect-redis')(require('express-session'))
const redis = require('redis')

const logger = require('./logger')

const { REDIS } = require('./')

process.stdout.write(JSON.stringify({ REDIS }, null, 2))

const defaultOptions = {
  ...REDIS.SESSION,
  logErrors: logger.error,
}

let store

module.exports = function redisStore(options = defaultOptions) {
  if (store) {
    return store
  }

  const client = redis.createClient(options)
  bluebird.promisifyAll(client)

  store = new RedisStore({ client })

  return store
}
