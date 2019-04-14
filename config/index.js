/* eslint no-process-env: "off" */

const isDev = process.env.NODE_ENV !== 'production'

const config = {
  isDev,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'error'),
}

module.exports = config
