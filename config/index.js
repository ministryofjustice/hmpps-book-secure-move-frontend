/* eslint no-process-env: "off" */
require('dotenv').config()

const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const SERVER_HOST = process.env.HEROKU_APP_NAME
  ? `${process.env.HEROKU_APP_NAME}.herokuapp.com`
  : process.env.SERVER_HOST
const BASE_URL = `${IS_PRODUCTION ? 'https' : 'http'}://${SERVER_HOST}`
const API_BASE_URL = process.env.API_BASE_URL
const AUTH_BASE_URL = process.env.AUTH_PROVIDER_URL
const AUTH_KEY = process.env.AUTH_PROVIDER_KEY
const NOMIS_ELITE2_API_BASE_URL = process.env.NOMIS_ELITE2_API_URL
const SESSION = {
  DB: process.env.SESSION_DB_INDEX || 0,
  NAME: process.env.SESSION_NAME || 'book-secure-move.sid',
  SECRET: process.env.SESSION_SECRET,
  TTL: process.env.SESSION_TTL || 60 * 30 * 1000, // 30 mins
}

function _authUrl(path) {
  return AUTH_BASE_URL ? new URL(path, AUTH_BASE_URL).href : ''
}

module.exports = {
  ANALYTICS: {
    GA_ID: process.env.GOOGLE_ANALYTICS_ID,
  },
  API: {
    AUTH_URL: API_BASE_URL + process.env.API_AUTH_PATH,
    BASE_URL: API_BASE_URL + process.env.API_PATH,
    CACHE_EXPIRY: process.env.API_CACHE_EXPIRY || 60 * 60 * 24 * 7, // in seconds (7 days)
    CLIENT_ID: process.env.API_CLIENT_ID,
    DISABLE_CACHE: process.env.API_DISABLE_CACHE,
    HEALTHCHECK_URL: API_BASE_URL + process.env.API_HEALTHCHECK_PATH,
    SECRET: process.env.API_SECRET,
    TIMEOUT: 30000, // in milliseconds
  },
  ASSETS_HOST: process.env.ASSETS_HOST || '',
  AUTH_BYPASS_SSO: process.env.BYPASS_SSO && IS_DEV,
  AUTH_EXPIRY_MARGIN: process.env.AUTH_EXPIRY_MARGIN || 5 * 60, // 5 minutes
  AUTH_PROVIDERS: {
    hmpps: {
      access_url: _authUrl('/auth/oauth/token'),
      authorize_url: _authUrl('/auth/oauth/authorize'),
      groups_url: userName => {
        return _authUrl(`/auth/api/authuser/${userName}/groups`)
      },
      healthcheck_url: _authUrl('/auth/ping'),
      key: AUTH_KEY,
      logout_url: _authUrl(
        `/auth/logout?client_id=${AUTH_KEY}&redirect_uri=${BASE_URL}`
      ),
      oauth: 2,
      response: ['tokens', 'jwt'],
      scope: ['read'],
      secret: process.env.AUTH_PROVIDER_SECRET,
      token_endpoint_auth_method: 'client_secret_basic',
      user_url: _authUrl('/auth/api/user/me'),
    },
  },
  AUTH_WHITELIST_URLS: [
    '/auth',
    '/auth/callback',
    '/auth/sign-out',
    '/healthcheck',
    '/healthcheck/ping',
  ],
  BUILD_BRANCH: process.env.APP_BUILD_TAG,
  BUILD_DATE: process.env.APP_BUILD_DATE,
  DATE_FORMATS: {
    LONG: 'd MMM yyyy',
    SHORT: 'd M yyyy',
    URL_PARAM: 'yyyy-MM-dd',
    WEEK_STARTS_ON: 1,
    WITH_DAY: 'EEEE d MMM yyyy',
  },
  DEFAULT_AUTH_PROVIDER: 'hmpps',
  E2E: {
    BASE_URL: process.env.E2E_BASE_URL || BASE_URL,
    ROLES: {
      OCA: {
        password: process.env.E2E_OCA_PASSWORD,
        username: process.env.E2E_OCA_USERNAME,
      },
      POLICE: {
        password: process.env.E2E_POLICE_PASSWORD,
        username: process.env.E2E_POLICE_USERNAME,
      },
      PRISON: {
        password: process.env.E2E_PRISON_PASSWORD,
        username: process.env.E2E_PRISON_USERNAME,
      },
      STC: {
        password: process.env.E2E_STC_PASSWORD,
        username: process.env.E2E_STC_USERNAME,
      },
      SUPPLIER: {
        password: process.env.E2E_SUPPLIER_PASSWORD,
        username: process.env.E2E_SUPPLIER_USERNAME,
      },
    },
  },
  FEATURE_FLAGS: {
    EDITABILITY: process.env.FEATURE_FLAG_EDITABILITY,
  },
  FEEDBACK_URL: process.env.FEEDBACK_URL,
  FILE_UPLOADS: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50mb
    UPLOAD_DIR: '.tmp/uploads/',
  },
  GIT_SHA: process.env.APP_GIT_COMMIT,
  IS_DEV,
  IS_PRODUCTION,
  LOCATIONS_BATCH_SIZE: process.env.LOCATIONS_BATCH_SIZE || 40,
  LOG_LEVEL: process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error'),
  NO_CACHE: process.env.CACHE_ASSETS ? false : IS_DEV,
  NOMIS_ELITE2_API: {
    healthcheck_url: `${NOMIS_ELITE2_API_BASE_URL}/ping`,
    user_caseloads_url: `${NOMIS_ELITE2_API_BASE_URL}/api/users/me/caseLoads`,
  },
  PLACEHOLDER_IMAGES: {
    PERSON: 'images/person-fallback.png',
  },
  PORT: process.env.PORT || 3000,
  REDIS: {
    SESSION: {
      auth_pass: process.env.REDIS_AUTH_TOKEN,
      db: SESSION.DB,
      host: process.env.REDIS_HOST,
      tls: process.env.REDIS_AUTH_TOKEN
        ? { checkServerIdentity: () => undefined }
        : null,
      ttl: SESSION.TTL / 1000, // convert nanoseconds to seconds
      url: process.env.REDIS_URL,
    },
  },
  SENTRY: {
    DSN: process.env.SENTRY_DSN,
    ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || 'production',
  },
  SERVER_HOST,
  SESSION,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  TAG_CATEGORY_WHITELIST: {
    health: {
      sortOrder: 2,
      tagClass: '',
    },
    risk: {
      sortOrder: 1,
      tagClass: 'app-tag--destructive',
    },
  },
  USER_LOCATIONS: process.env.USER_LOCATIONS,
  USER_PERMISSIONS: process.env.USER_PERMISSIONS,
}
