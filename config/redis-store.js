const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const bluebird = require('bluebird')

const { REDIS } = require('./')
const logger = require('./logger')

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
