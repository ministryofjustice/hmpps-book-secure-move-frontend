const session = require('express-session')
const { RedisStore } = require('connect-redis')
const redis = require('redis')

const logger = require('./logger')
const { REDIS } = require('./')

const defaultOptions = {
  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(2 ** retries * 50, 60_000)
      logger.error(`Redis reconnect attempt ${retries}, retrying in ${delay}ms`)
      return delay
    },
  },
  ...REDIS.SESSION,
}

let store

module.exports = async function redisStore(options = defaultOptions) {
  if (store) {
    return store
  }

  const client = redis.createClient(options)

  client.on('error', (err) => {
    logger.error(err)
  })

  await client.connect()

  store = new RedisStore({
    client,
    prefix: 'sess:',
  })

  return store
}
