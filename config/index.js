/* eslint no-process-env: "off" */
const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

module.exports = {
  IS_DEV,
  IS_PRODUCTION,
  PORT,
  SERVER_HOST: process.env.SERVER_HOST || `localhost:${PORT}`,
  LOG_LEVEL: process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error'),
  NO_CACHE: process.env.CACHE_ASSETS ? false : IS_DEV,
  API: {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api/v1',
  },
  DATE_FORMATS: {
    SHORT: 'D M YYYY',
    LONG: 'D MMM YYYY',
    WITH_DAY: 'dddd D MMM YYYY',
  },
  ASSETS_HOST: process.env.ASSETS_HOST || '',
  SESSION: {
    SECRET: process.env.SESSION_SECRET,
    REDIS_STORE_DATABASE: process.env.REDIS_SESSION_DB || 0,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: process.env.REDIS_PORT || 6379,
  },
  AUTH: {
    PROVIDER_KEY: process.env.AUTH_PROVIDER_KEY,
    PROVIDER_SECRET: process.env.AUTH_PROVIDER_SECRET,
    OKTA_SUBDOMAIN: process.env.OKTA_SUBDOMAIN,
  },
}
