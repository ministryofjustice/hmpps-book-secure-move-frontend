const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const client = redis.createClient()
let store

module.exports = function redisStore(options) {
  if (store) {
    return store
  }

  if (!options) {
    return
  }

  store = new RedisStore({
    ...options,
    client,
  })

  return store
}
