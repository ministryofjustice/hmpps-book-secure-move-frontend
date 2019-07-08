/* eslint no-process-env: "off" */
require('dotenv').config()

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const AUTH_BASE_URL = process.env.AUTH_PROVIDER_URL
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
  BUILD_DATE: process.env.APP_BUILD_DATE,
  BUILD_BRANCH: process.env.APP_BUILD_TAG,
  GIT_SHA: process.env.APP_GIT_COMMIT,
  CURRENT_LOCATION_UUID: process.env.CURRENT_LOCATION_UUID,
  API: {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
    HEALTHCHECK_URL: process.env.API_HEALTHCHECK_URL,
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
  SENTRY: {
    KEY: process.env.SENTRY_KEY,
    PROJECT: process.env.SENTRY_PROJECT,
  },
  REDIS: {
    SESSION: {
      url: process.env.REDIS_URL,
      auth_pass: process.env.REDIS_AUTH_TOKEN,
      db: SESSION.DB,
      tls: process.env.REDIS_AUTH_TOKEN
        ? { checkServerIdentity: () => undefined }
        : null,
      ttl: SESSION.TTL / 1000, // convert nanoseconds to seconds
    },
  },
  AUTH_BYPASS_SSO: process.env.BYPASS_SSO && IS_DEV,
  AUTH_WHITELIST_URLS: [
    '/auth',
    '/auth/callback',
    '/healthcheck',
    '/healthcheck/ping',
  ],
  AUTH_PROVIDERS: {
    hmpps: {
      oauth: 2,
      scope: ['read'],
      response: ['tokens', 'jwt'],
      token_endpoint_auth_method: 'client_secret_basic',
      authorize_url: AUTH_BASE_URL
        ? new URL('/auth/oauth/authorize', AUTH_BASE_URL).href
        : '',
      access_url: AUTH_BASE_URL
        ? new URL('/auth/oauth/token', AUTH_BASE_URL).href
        : '',
      healthcheck_url: AUTH_BASE_URL
        ? new URL('/auth/ping', AUTH_BASE_URL).href
        : '',
      key: process.env.AUTH_PROVIDER_KEY,
      secret: process.env.AUTH_PROVIDER_SECRET,
    },
  },
  DEFAULT_AUTH_PROVIDER: 'hmpps',
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
