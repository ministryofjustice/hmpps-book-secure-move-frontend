const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

let store

module.exports = function redisStore(options) {
  if (store) {
    return store
  }

  if (!options) {
    return
  }

  const client = redis.createClient(options)
  store = new RedisStore({ client })

  return store
}
