const session = require('express-session')
const { RedisStore } = require('connect-redis')
const redis = require('redis')

const logger = require('./logger')
const { REDIS } = require('./')
const { SESSION } = require('./index')

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
  options.socket = {
      host: process.env.REDIS_HOST,
      tls: !!process.env.REDIS_AUTH_TOKEN,
      rejectUnauthorized: false,
      keepAlive: SESSION.TTL / 1000, // convert nanoseconds to seconds
    }
    database: SESSION.DB,
    password: process.env.REDIS_AUTH_TOKEN,}

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
