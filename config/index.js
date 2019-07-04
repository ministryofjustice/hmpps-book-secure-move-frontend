/* eslint no-process-env: "off" */
require('dotenv').config()
const { buildRedisUrl } = require('./redis-helpers')

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const SESSION = {
  NAME: process.env.SESSION_NAME || 'book-secure-move.sid',
  SECRET: process.env.SESSION_SECRET,
  TTL: process.env.SESSION_TTL || 60 * 30 * 1000, // 30 mins
  DB: process.env.SESSION_DB_INDEX || 0,
}

module.exports = {
  IS_DEV,
  IS_PRODUCTION,
  SESSION,
  PORT: process.env.PORT || 3000,
  SERVER_HOST: process.env.SERVER_HOST,
  LOG_LEVEL: process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error'),
  NO_CACHE: process.env.CACHE_ASSETS ? false : IS_DEV,
  FEEDBACK_URL: process.env.FEEDBACK_URL,
  API: {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:4000/api/v1',
    AUTH_URL: process.env.API_AUTH_URL,
    CLIENT_ID: process.env.API_CLIENT_ID,
    SECRET: process.env.API_SECRET,
  },
  DATE_FORMATS: {
    SHORT: 'D M YYYY',
    LONG: 'D MMM YYYY',
    WITH_DAY: 'dddd D MMM YYYY',
  },
  ASSETS_HOST: process.env.ASSETS_HOST || '',
  REDIS: {
    SESSION: {
      url: buildRedisUrl(),
      db: SESSION.DB,
      ttl: SESSION.TTL / 1000, // convert nanoseconds to seconds
    },
  },
  AUTH: {
    PROVIDER_KEY: process.env.AUTH_PROVIDER_KEY,
    PROVIDER_SECRET: process.env.AUTH_PROVIDER_SECRET,
    PROVIDER_URL: process.env.AUTH_PROVIDER_URL,
  },
  TAG_CATEGORY_WHITELIST: {
    risk: {
      tagClass: 'app-tag--destructive',
      sortOrder: 1,
    },
    health: {
      tagClass: '',
      sortOrder: 2,
    },
  },
}
