import { NextFunction } from 'express'
import { get } from 'lodash'

import { BasmError } from '../../common/types/basm_error'
import { BasmRequest } from '../../common/types/basm_request'
import { BasmResponse } from '../../common/types/basm_response'

const { decodeAccessToken } = require('../../common/lib/access-token')
const { loadUser } = require('../../common/lib/user')
const { OFF_NETWORK_ALLOWLIST } = require('../../config')

function processAuthResponse() {
  return async function middleware(
    req: BasmRequest,
    _res: BasmResponse,
    next: NextFunction
  ) {
    const accessToken = get(req.session, 'grant.response.access_token')

    if (!accessToken) {
      const error = new Error('Could not authenticate user') as BasmError
      error.statusCode = 403
      return next(error)
    }

    try {
      const decodedAccessToken = decodeAccessToken(accessToken)
      const previousSession = { ...req.session }

      const user = await loadUser(req, accessToken)

      req.session.regenerate((error: BasmError) => {
        if (error) {
          return next(error)
        }

        req.session.authExpiry = decodedAccessToken.exp

        const authSource = decodedAccessToken.auth_source

        if (authSource !== 'auth' && OFF_NETWORK_ALLOWLIST !== '*') {
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
            const error = new Error(
              'Access denied from this network location'
            ) as BasmError
            error.statusCode = 403
            return next(error)
          }
        }

        req.session.user = user

        // copy any previous session properties ignoring grant or any that already exist
        Object.keys(previousSession).forEach(key => {
          if (req.session[key]) {
            return
          }

          req.session[key] = previousSession[key]
        })

        next()
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  processAuthResponse,
}
