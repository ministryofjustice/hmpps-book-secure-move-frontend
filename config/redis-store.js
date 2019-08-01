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

  store = new RedisStore(options)

  return store
}
