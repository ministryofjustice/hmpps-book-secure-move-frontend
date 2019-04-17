/* eslint no-process-env: "off" */
const path = require('path')

const ROOT = path.normalize(`${__dirname}/..`)
const IS_DEV = process.env.NODE_ENV !== 'production'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  ROOT,
  IS_DEV,
  IS_PRODUCTION,
  PORT: process.env.PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || (IS_DEV ? 'debug' : 'error'),
  BUILD_DIRECTORY: path.resolve(ROOT, '.build'),
  NO_CACHE: process.env.CACHE_ASSETS ? false : IS_DEV,
}
