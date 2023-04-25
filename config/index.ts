/* eslint no-process-env: "off" */
import fs from 'fs'
import path from 'path'

import semverSort from 'semver-sort'

// TODO: convert this file to TS and remove this ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { frameworks as frameworksPaths } from './paths'

export const { version: APP_VERSION } = require('../package.json')

require('dotenv').config()

const API_VERSION = process.env.API_VERSION
export const IS_DEV = process.env.NODE_ENV !== 'production'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const SUPPORT_URL = IS_PRODUCTION
  ? 'https://support.hmpps.service.justice.gov.uk/feedback-and-support/book-secure-move'
  : 'https://support-dev.hmpps.service.justice.gov.uk/feedback-and-support/book-secure-move'
export const SERVER_HOST = process.env.HEROKU_APP_NAME
  ? `${process.env.HEROKU_APP_NAME}.herokuapp.com`
  : process.env.SERVER_HOST
const BASE_URL = `${IS_PRODUCTION ? 'https' : 'http'}://${SERVER_HOST}`
const API_BASE_URL = process.env.API_BASE_URL || ''
export const AUTH_BASE_URL = process.env.AUTH_PROVIDER_URL
const AUTH_KEY = process.env.AUTH_PROVIDER_KEY
const NOMIS_ELITE2_API_BASE_URL = process.env.NOMIS_ELITE2_API_URL
const NOMIS_ELITE2_API_HEALTHCHECK_PATH =
  process.env.NOMIS_ELITE2_API_HEALTHCHECK_PATH || '/health/ping'
export const SESSION = {
  NAME: process.env.SESSION_NAME || 'book-secure-move.sid',
  SECRET: process.env.SESSION_SECRET,
  TTL: (process.env.SESSION_TTL || 60 * 30 * 1000) as number, // 30 mins
  DB: process.env.SESSION_DB_INDEX || 0,
}
export const REDIS: {
  SESSION?: {
    url?: string
    database?: string | number
    password?: string
    socket?: {
      host?: string
      tls?: boolean
      rejectUnauthorized?: boolean
      keepAlive?: number
    }
  }
} = {}

if (process.env.REDIS_URL) {
  REDIS.SESSION = {
    url: process.env.REDIS_URL,
  }
} else if (process.env.REDIS_HOST) {
  REDIS.SESSION = {
    socket: {
      host: process.env.REDIS_HOST,
      tls: !!process.env.REDIS_AUTH_TOKEN,
      rejectUnauthorized: false,
      keepAlive: SESSION.TTL / 1000, // convert nanoseconds to seconds
    },
    database: SESSION.DB,
    password: process.env.REDIS_AUTH_TOKEN,
  }
}

let LATEST_FRAMEWORKS_BUILD

try {
  const folderPath = path.resolve(frameworksPaths.output)
  const versions = fs.readdirSync(folderPath)

  LATEST_FRAMEWORKS_BUILD = semverSort.desc(versions)[0]
} catch (e) {}

function _authUrl(path: string) {
  return AUTH_BASE_URL ? new URL(path, AUTH_BASE_URL).href : ''
}

export const AUTH_EXPIRY_MARGIN = process.env.AUTH_EXPIRY_MARGIN || 5 * 60 // 5 minutes
export const PORT = process.env.PORT || 3000
export const LOG_LEVEL = process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error')
export const STATIC_ASSETS = {
  CACHE_MAX_AGE:
    process.env.STATIC_ASSETS_CACHE_MAX_AGE || (IS_PRODUCTION ? '1w' : false),
}
export const FEEDBACK_URL = process.env.FEEDBACK_URL
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL
export const APP_BUILD_DATE = process.env.APP_BUILD_DATE
export const APP_BUILD_BRANCH = process.env.APP_BUILD_BRANCH
export const APP_BUILD_TAG = process.env.APP_BUILD_TAG
export const APP_GIT_SHA = process.env.APP_GIT_COMMIT
export const API = {
  VERSION: Number(API_VERSION),
  BASE_URL: API_BASE_URL + process.env.API_PATH,
  AUTH_TIMEOUT: Number(process.env.API_AUTH_TIMEOUT || 10000), // in milliseconds
  AUTH_URL: API_BASE_URL + process.env.API_AUTH_PATH,
  HEALTHCHECK_URL: API_BASE_URL + process.env.API_HEALTHCHECK_PATH,
  CLIENT_ID: process.env.API_CLIENT_ID,
  SECRET: process.env.API_SECRET,
  TIMEOUT: Number(process.env.API_TIMEOUT || 30000), // in milliseconds
  CACHE_EXPIRY: process.env.API_CACHE_EXPIRY || 60 * 60 * 24 * 7, // in seconds (7 days)
  USE_REDIS_CACHE: !!REDIS.SESSION,
}

export const MAPPING = {
  AUTH_URL: `${process.env.ORDNANCE_MAP_API_URL}/oauth2/token/v1`,
  TILE_URL: `${process.env.ORDNANCE_MAP_API_URL}/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}`,
  API_KEY: process.env.ORDNANCE_MAP_API_KEY,
  API_SECRET: process.env.ORDNANCE_MAP_API_SECRET,
}
export const PLACEHOLDER_IMAGES = {
  PERSON: 'images/person-fallback.png',
}
export const DATE_FORMATS = {
  SHORT: 'd M yyyy',
  LONG: 'd MMM yyyy',
  WITH_MONTH: 'd MMMM yyyy',
  WITH_DAY: 'EEEE d MMM yyyy',
  WITH_TIME_AND_DAY: "HH:mm 'on' EEEE d MMM yyyy",
  WITH_TIME_AND_DAY_FOR_EVENTS: "d MMMM yyyy 'at' HH:mm",
  WITH_TIME_WITH_SECONDS_AND_DAY: "H:mm:ss 'on' EEEE d MMM yyyy",
  URL_PARAM: 'yyyy-MM-dd',
  WEEK_STARTS_ON: 1,
}
export const ENABLE_COMPONENTS_LIBRARY =
  IS_DEV || /true/i.test(process.env.ENABLE_COMPONENTS_LIBRARY || '')
export const ENABLE_DEVELOPMENT_TOOLS =
  IS_DEV || /true/i.test(process.env.ENABLE_DEVELOPMENT_TOOLS || '')
export const FILE_UPLOADS = {
  UPLOAD_DIR: '.tmp/uploads/',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50mb
}
export const ASSETS_HOST = process.env.ASSETS_HOST || ''
export const SENTRY = {
  DEBUG: /true/i.test(process.env.SENTRY_DEBUG || ''),
  DSN: process.env.SENTRY_DSN,
  ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || 'production',
  RELEASE: process.env.APP_GIT_COMMIT,
}
export const PROMETHEUS = {
  MOUNTPATH: process.env.PROMETHEUS_MOUNTPATH,
}
export const USER_PERMISSIONS = process.env.USER_PERMISSIONS
export const USER_LOCATIONS = process.env.USER_LOCATIONS
export const USER_USERNAME = process.env.USER_USERNAME
export const AUTH_BYPASS_SSO = process.env.BYPASS_SSO && IS_DEV
export const AUTH_WHITELIST_URLS = [
  '/auth',
  '/auth/callback',
  '/auth/sign-out',
  '/healthcheck',
  '/healthcheck/ping',
  '/components',
  '/components/(.*)',
  '/help',
  '/help/(.*)',
]
export const AUTH_PROVIDERS = {
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
    groups_url: (username: string) =>
      _authUrl(`/auth/api/authuser/${username}/groups`),
    user_url: (username: string) => _authUrl(`/auth/api/user/${username}`),
    key: AUTH_KEY,
    secret: process.env.AUTH_PROVIDER_SECRET,
  },
}
export const DEFAULT_AUTH_PROVIDER = 'hmpps'
export const NOMIS_ELITE2_API = {
  user_caseloads_url: `${NOMIS_ELITE2_API_BASE_URL}/api/users/me/caseLoads`,
  healthcheck_url: `${NOMIS_ELITE2_API_BASE_URL}${NOMIS_ELITE2_API_HEALTHCHECK_PATH}`,
}
export const CONTENTFUL_SPACE_ID =
  process.env.CONTENTFUL_SPACE_ID || (IS_PRODUCTION ? null : 'space')
export const CONTENTFUL_ACCESS_TOKEN =
  process.env.CONTENTFUL_ACCESS_TOKEN || (IS_PRODUCTION ? null : 'access-token')
export const CONTENTFUL_HOST =
  process.env.CONTENTFUL_HOST || 'cdn.contentful.com'
export const ANALYTICS = {
  GA_ID: process.env.GOOGLE_ANALYTICS_ID,
}
export const TAG_CATEGORY_WHITELIST = {
  risk: {
    tagClass: 'app-tag--destructive',
    sortOrder: 1,
  },
  health: {
    tagClass: '',
    sortOrder: 2,
  },
}
export const ASSESSMENT_ANSWERS_CATEGORY_SETTINGS = {
  risk: {
    frameworksSection: 'risk-information',
    tagClass: 'app-tag--destructive',
    sortOrder: 1,
  },
  health: {
    frameworksSection: 'health-information',
    tagClass: '',
    sortOrder: 2,
  },
  court: {
    sortOrder: 3,
  },
}
export const LOCATIONS_BATCH_SIZE = process.env.LOCATIONS_BATCH_SIZE || 40
export const E2E = {
  BASE_URL: process.env.E2E_BASE_URL || BASE_URL,
  USERS: {
    COURT: {
      locations: ['ABDRCT', 'BDFRCT'],
      name: 'End-to-end Court',
      authorities: ['ROLE_PECS_COURT'],
      username: 'E2E_COURT',
      password: '102PF_COURT',
    },
    POLICE: {
      locations: ['SRY016', 'CLP1'],
      name: 'End-to-end Police',
      authorities: ['ROLE_PECS_POLICE'],
      username: 'E2E_POLICE',
      password: '102PF_POLICE',
    },
    PRISON: {
      locations: ['WYI'],
      name: 'End-to-end Prison',
      authorities: ['ROLE_PECS_PRISON'],
      username: 'E2E_PRISON',
      password: '102PF_PRISON',
    },
    SECURE_CHILDRENS_HOME: {
      locations: ['SCH9'],
      name: 'End-to-end Secure Childrens Home',
      authorities: ['ROLE_PECS_SCH'],
      username: 'E2E_SECURE_CHILDRENS_HOME',
      password: '102PF_SECURE_CHILDRENS_HOME',
    },
    SECURE_TRAINING_CENTRE: {
      locations: ['STC3'],
      name: 'End-to-end Secure Training Centre',
      authorities: ['ROLE_PECS_STC'],
      username: 'E2E_SECURE_TRAINING_CENTRE',
      password: '102PF_SECURE_TRAINING_CENTRE',
    },
    OPERATIONAL_CAPACITY_ALLOCATION: {
      locations: ['WYI'],
      name: 'End-to-end Operational Capacity Allocation',
      authorities: ['ROLE_PECS_OCA'],
      username: 'E2E_OPERATIONAL_CAPACITY_ALLOCATION',
      password: '102PF_OPERATIONAL_CAPACITY_ALLOCATION',
    },
    POPULATION_MANAGEMENT_UNIT: {
      locations: ['BXI', 'BZI', 'NMI', 'PVI', 'TSI'],
      name: 'End-to-end Population Management Unit',
      authorities: ['ROLE_PECS_PMU', 'ROLE_PRISON', 'ROLE_PECS_PRISON'],
      auth_source: 'nomis',
      username: 'E2E_POPULATION_MANAGEMENT_UNIT',
      password: '102PF_POPULATION_MANAGEMENT_UNIT',
    },
    SUPPLIER: {
      locations: ['GEOAMEY'],
      name: 'End-to-end Supplier',
      authorities: ['ROLE_PECS_SUPPLIER'],
      username: 'E2E_SUPPLIER',
      password: '102PF_SUPPLIER',
    },
    PERSON_ESCORT_RECORD: {
      locations: ['SRY016', 'MPS2'],
      name: 'End-to-end Person Escort Record',
      authorities: ['ROLE_PECS_POLICE', 'ROLE_PECS_PER_AUTHOR'],
      username: 'E2E_PERSON_ESCORT_RECORD',
      password: '102PF_PERSON_ESCORT_RECORD',
    },
    CONTRACT_DELIVERY_MANAGER: {
      name: 'End-to-end Contract Delivery Manager',
      authorities: ['ROLE_PECS_CDM'],
      username: 'E2E_CONTRACT_DELIVERY_MANAGER',
      password: '102PF_CONTRACT_DELIVERY_MANAGER',
    },
    READ_ONLY: {
      name: 'Read Only',
      authorities: ['ROLE_PECS_READ_ONLY'],
      username: 'E2E_READ_ONLY',
      password: '102PF_READ_ONLY',
    },
  },
}
export const FEATURE_FLAGS = {
  GOT: /true/i.test(process.env.FEATURE_FLAG_GOT || ''),
  ADD_LODGE_BUTTON: /true/i.test(
    process.env.FEATURE_FLAG_ADD_LODGE_BUTTON || ''
  ),
  DATE_OF_ARREST: /true/i.test(process.env.FEATURE_FLAG_DATE_OF_ARREST || ''),
}
export const FRAMEWORKS = {
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
}
