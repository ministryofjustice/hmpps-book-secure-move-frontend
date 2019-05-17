/* eslint no-process-env: "off" */
const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  IS_DEV,
  IS_PRODUCTION,
  PORT: process.env.PORT || 3000,
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
}
