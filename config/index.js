/* eslint no-process-env: "off" */
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const semverSort = require('semver-sort')

const { frameworks: frameworksPaths } = require('./paths')

const API_VERSION = process.env.API_VERSION

if (!API_VERSION) {
  throw new Error('The API_VERSION environment variable must be set')
}

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
const NOMIS_ELITE2_API_HEALTHCHECK_PATH =
  process.env.NOMIS_ELITE2_API_HEALTHCHECK_PATH || '/health/ping'
const SESSION = {
  NAME: process.env.SESSION_NAME || 'book-secure-move.sid',
  SECRET: process.env.SESSION_SECRET,
  TTL: process.env.SESSION_TTL || 60 * 30 * 1000, // 30 mins
  DB: process.env.SESSION_DB_INDEX || 0,
}

let LATEST_FRAMEWORKS_BUILD

try {
  const folderPath = path.resolve(frameworksPaths.output)
  const versions = fs.readdirSync(folderPath)

  LATEST_FRAMEWORKS_BUILD = semverSort.desc(versions)[0]
} catch (e) {}

function _authUrl(path) {
  return AUTH_BASE_URL ? new URL(path, AUTH_BASE_URL).href : ''
}

module.exports = {
  IS_DEV,
  IS_PRODUCTION,
  SESSION,
  AUTH_EXPIRY_MARGIN: process.env.AUTH_EXPIRY_MARGIN || 5 * 60, // 5 minutes
  SERVER_HOST,
  PORT: process.env.PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error'),
  NO_CACHE: process.env.CACHE_ASSETS ? false : IS_DEV,
  FEEDBACK_URL: process.env.FEEDBACK_URL,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  APP_BUILD_DATE: process.env.APP_BUILD_DATE,
  APP_BUILD_BRANCH: process.env.APP_BUILD_BRANCH,
  APP_BUILD_TAG: process.env.APP_BUILD_TAG,
  APP_GIT_SHA: process.env.APP_GIT_COMMIT,
  API: {
    VERSION: Number(API_VERSION),
    BASE_URL: API_BASE_URL + process.env.API_PATH,
    AUTH_URL: API_BASE_URL + process.env.API_AUTH_PATH,
    HEALTHCHECK_URL: API_BASE_URL + process.env.API_HEALTHCHECK_PATH,
    CLIENT_ID: process.env.API_CLIENT_ID,
    SECRET: process.env.API_SECRET,
    TIMEOUT: Number(process.env.API_TIMEOUT || 30000), // in milliseconds
    CACHE_EXPIRY: process.env.API_CACHE_EXPIRY || 60 * 60 * 24 * 7, // in seconds (7 days)
    DISABLE_CACHE: process.env.API_DISABLE_CACHE,
  },
  PLACEHOLDER_IMAGES: {
    PERSON: 'images/person-fallback.png',
  },
  DATE_FORMATS: {
    SHORT: 'd M yyyy',
    LONG: 'd MMM yyyy',
    WITH_DAY: 'EEEE d MMM yyyy',
    URL_PARAM: 'yyyy-MM-dd',
    WEEK_STARTS_ON: 1,
  },
  FILE_UPLOADS: {
    UPLOAD_DIR: '.tmp/uploads/',
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50mb
  },
  ASSETS_HOST: process.env.ASSETS_HOST || '',
  SENTRY: {
    DSN: process.env.SENTRY_DSN,
    ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || 'production',
  },
  REDIS: {
    SESSION: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST,
      auth_pass: process.env.REDIS_AUTH_TOKEN,
      db: SESSION.DB,
      tls: process.env.REDIS_AUTH_TOKEN
        ? { checkServerIdentity: () => undefined }
        : null,
      ttl: SESSION.TTL / 1000, // convert nanoseconds to seconds
    },
  },
  USER_PERMISSIONS: process.env.USER_PERMISSIONS,
  USER_LOCATIONS: process.env.USER_LOCATIONS,
  AUTH_BYPASS_SSO: process.env.BYPASS_SSO && IS_DEV,
  AUTH_WHITELIST_URLS: [
    '/auth',
    '/auth/callback',
    '/auth/sign-out',
    '/healthcheck',
    '/healthcheck/ping',
  ],
  AUTH_PROVIDERS: {
    hmpps: {
      oauth: 2,
      scope: ['read'],
      response: ['tokens', 'jwt'],
      token_endpoint_auth_method: 'client_secret_basic',
      authorize_url: _authUrl('/auth/oauth/authorize'),
      access_url: _authUrl('/auth/oauth/token'),
      healthcheck_url: _authUrl('/auth/ping'),
      logout_url: _authUrl(
        `/auth/logout?client_id=${AUTH_KEY}&redirect_uri=${BASE_URL}`
      ),
      groups_url: userName => {
        return _authUrl(`/auth/api/authuser/${userName}/groups`)
      },
      user_url: _authUrl('/auth/api/user/me'),
      key: AUTH_KEY,
      secret: process.env.AUTH_PROVIDER_SECRET,
    },
  },
  DEFAULT_AUTH_PROVIDER: 'hmpps',
  NOMIS_ELITE2_API: {
    user_caseloads_url: `${NOMIS_ELITE2_API_BASE_URL}/api/users/me/caseLoads`,
    healthcheck_url: `${NOMIS_ELITE2_API_BASE_URL}${NOMIS_ELITE2_API_HEALTHCHECK_PATH}`,
  },
  ANALYTICS: {
    GA_ID: process.env.GOOGLE_ANALYTICS_ID,
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
  LOCATIONS_BATCH_SIZE: process.env.LOCATIONS_BATCH_SIZE || 40,
  E2E: {
    BASE_URL: process.env.E2E_BASE_URL || BASE_URL,
    ROLES: {
      POLICE: {
        username: process.env.E2E_POLICE_USERNAME,
        password: process.env.E2E_POLICE_PASSWORD,
      },
      STC: {
        username: process.env.E2E_STC_USERNAME,
        password: process.env.E2E_STC_PASSWORD,
      },
      SCH: {
        username: process.env.E2E_SCH_USERNAME,
        password: process.env.E2E_SCH_PASSWORD,
      },
      PRISON: {
        username: process.env.E2E_PRISON_USERNAME,
        password: process.env.E2E_PRISON_PASSWORD,
      },
      SUPPLIER: {
        username: process.env.E2E_SUPPLIER_USERNAME,
        password: process.env.E2E_SUPPLIER_PASSWORD,
      },
      OCA: {
        username: process.env.E2E_OCA_USERNAME,
        password: process.env.E2E_OCA_PASSWORD,
      },
      PMU: {
        username: process.env.E2E_PMU_USERNAME,
        password: process.env.E2E_PMU_PASSWORD,
      },
    },
  },
  FEATURE_FLAGS: {
    PERSON_ESCORT_RECORD: /true/i.test(
      process.env.FEATURE_FLAG_PERSON_ESCORT_RECORD
    ),
  },
  FRAMEWORKS: {
    CURRENT_VERSION: process.env.FRAMEWORKS_VERSION || LATEST_FRAMEWORKS_BUILD,
    FLAG_SETTINGS: {
      alert: {
        tagClass: 'app-tag--destructive',
        sortOrder: 1,
      },
      warning: {
        tagClass: 'app-tag--warning',
        sortOrder: 2,
      },
      attention: {
        tagClass: '',
        sortOrder: 3,
      },
      information: {
        tagClass: 'app-tag--inactive',
        sortOrder: 4,
      },
    },
  },
}
