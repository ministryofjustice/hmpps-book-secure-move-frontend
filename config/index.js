/* eslint no-process-env: "off" */
const path = require('path')

const root = path.normalize(`${__dirname}/..`)
const isDev = process.env.NODE_ENV !== 'production'

const config = {
  root,
  isDev,
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || (isDev ? 'debug' : 'error'),
  buildDirectory: path.resolve(root, '.build'),
}

module.exports = config
