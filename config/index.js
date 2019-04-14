/* eslint no-process-env: "off" */

const config = {
  isDev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
}

module.exports = config
