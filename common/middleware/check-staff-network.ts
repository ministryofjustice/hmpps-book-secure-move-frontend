import { NextFunction } from 'express'
import { get } from 'lodash'
import { Netmask } from 'netmask'


import {
  DISALLOWED_DEVICES,
  DISALLOWED_DEVICES_ACTIONS,
  OFF_NETWORK_ALLOWLIST,
  OFF_NETWORK_ALLOWLIST_ACTIONS,
} from '../../config'
import { BasmError } from '../types/basm_error'
import { BasmRequest } from '../types/basm_request'
import { BasmResponse } from '../types/basm_response'
import Sentry from '@sentry/node'

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
    if (ipAddress?.startsWith('::1')) {
      ipAddress = ipAddress.replace('::1', '127.0.0.1')
    }

    let device =  (req.headers && req.headers['user-agent'])

    if (DISALLOWED_DEVICES.some(d => device.includes(d))){
      if (DISALLOWED_DEVICES_ACTIONS.includes('WARN')){
        console.log(`${req.user.username} has accessed service from a disallowed device: ${device}`)
      }
      if (DISALLOWED_DEVICES_ACTIONS.includes('REPORT')){
        Sentry.captureException(new Error('User access from disallowed device'))
      }

      if (DISALLOWED_DEVICES_ACTIONS.includes('ENFORCE')){
        const error = new Error(
          'Access denied from this device'
        ) as BasmError
        error.statusCode = 403
        return next(error)
      }
    }
    if (
      ipAddress &&
      !OFF_NETWORK_ALLOWLIST.find(subnet =>
        new Netmask(subnet).contains(ipAddress!)
      )
    ) {
      if (OFF_NETWORK_ALLOWLIST_ACTIONS.includes('WARN')){
        console.log(`${req.user.id} has accessed service from an IP address outside of the allowlist: ${ipAddress}`)
      }

      if (OFF_NETWORK_ALLOWLIST_ACTIONS.includes('REPORT')){
        Sentry.captureException(new Error('User access from outside of allowlist'))
      }

      if (OFF_NETWORK_ALLOWLIST_ACTIONS.includes('ENFORCE')){
        const error = new Error(
          'Access denied from this network location'
        ) as BasmError
        error.statusCode = 403
        return next(error)
      }

    }
  }

  next()
}
