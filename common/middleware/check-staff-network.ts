import { NextFunction } from 'express'
import { get } from 'lodash'

import { OFF_NETWORK_ALLOWLIST } from '../../config'
import { BasmError } from '../types/basm_error'
import { BasmRequest } from '../types/basm_request'
import { BasmResponse } from '../types/basm_response'

const { decodeAccessToken } = require('../lib/access-token')

export default (req: BasmRequest, _res: BasmResponse, next: NextFunction) => {
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
    !OFF_NETWORK_ALLOWLIST.includes('*')
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

    if (ipAddress && !OFF_NETWORK_ALLOWLIST.includes(ipAddress)) {
      const error = new Error(
        'Access denied from this network location'
      ) as BasmError
      error.statusCode = 403
      return next(error)
    }
  }

  next()
}
