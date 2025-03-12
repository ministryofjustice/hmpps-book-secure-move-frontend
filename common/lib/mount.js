const fs = require('fs')
const path = require('path')

const debug = require('debug')('app:mount')
const express = require('express')
const { get } = require('lodash')

const { OFF_NETWORK_ALLOWLIST } = require('../../config')

const { decodeAccessToken } = require('./access-token')

const mount = dir => {
  const router = express.Router()
  const subApps = fs.readdirSync(dir, { withFileTypes: true })

  router.use((req, res, next) => {
    if (req.url.startsWith('/auth/') || req.url.startsWith('/connect/')) {
      return next()
    }

    const accessToken = get(req.session, 'grant.response.access_token')

    if (!accessToken) {
      return next()
    }

    const decodedAccessToken = decodeAccessToken(accessToken)

    if (
      decodedAccessToken.auth_source !== 'auth' &&
      OFF_NETWORK_ALLOWLIST !== '*'
    ) {
      // user is a staff member
      // check their IP address against OFF_NETWORK_ALLOWLIST
      let ipAddress =
        (req.headers && req.headers['x-forwarded-for']) ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress

      // convert ip from ipv6 to ipv4
      if (ipAddress?.startsWith('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '')
      }

      if (ipAddress && !(OFF_NETWORK_ALLOWLIST || '').includes(ipAddress)) {
        const error = new Error('Access denied from this network location')
        error.statusCode = 403
        return next(error)
      }
    }

    next()
  })

  const appRouters = subApps
    .filter(dirent => dirent.isDirectory())
    .filter(({ name }) => fs.existsSync(path.resolve(dir, name, 'index.js')))
    // eslint-disable-next-line array-callback-return
    .map(({ name }) => {
      debug('Loading app:', name)

      const subApp = require(path.resolve(dir, name))

      if (subApp.router && !subApp.skip) {
        debug('Loading router:', name)

        if (subApp.mountpath) {
          return router.use(subApp.mountpath, subApp.router)
        }

        return router.use(subApp.router)
      } else {
        debug('Skipping router:', name)
      }
    })
    .filter(used => used)

  return appRouters.length ? appRouters : (req, res, next) => next()
}

module.exports = mount
