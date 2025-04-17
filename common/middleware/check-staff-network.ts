import { NextFunction } from 'express'
import { get } from 'lodash'
import { Netmask } from 'netmask'
import * as Sentry from '@sentry/node'


import {
  DISALLOWED_DEVICES,
  DISALLOWED_DEVICES_ACTIONS,
  OFF_NETWORK_ALLOWLIST,
  OFF_NETWORK_ALLOWLIST_ACTIONS,
} from '../../config'

import { BasmError } from '../types/basm_error'
import { BasmRequest } from '../types/basm_request'
import { BasmResponse } from '../types/basm_response'

const { decodeAccessToken } = require('../lib/access-token')

export default (req: BasmRequest, _res: BasmResponse, next: NextFunction) => {
  const { url } = req
  if (
    url.startsWith('/auth/') ||
    url.startsWith('/connect/') ||
    (url.startsWith('/person/') && url.endsWith('/image'))
  ) {
    return next()
  }

  const accessToken = get(req.session, 'grant.response.access_token')

  if (!accessToken) {
    return next()
  }

  const decodedAccessToken = decodeAccessToken(accessToken)
  if (decodedAccessToken.auth_source !== 'auth') {
    // user is a staff member
    const device = (req.headers && req.headers['user-agent'] || 'Unknown')
    const badDevice = DISALLOWED_DEVICES && DISALLOWED_DEVICES.length > 0 && DISALLOWED_DEVICES.some(d => device.includes(d))

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
      ipAddress = '127.0.0.1'
    }
    const offNetwork = !ipAddressPermitted(ipAddress)

    //Do any logging we need to
    if (offNetwork && badDevice && (OFF_NETWORK_ALLOWLIST_ACTIONS.includes('WARN') || DISALLOWED_DEVICES_ACTIONS.includes('WARN'))) {
      console.log(`${req.user.username} has accessed service from a disallowed device and has an IP address outside of the allowlist: [${ipAddress}]`)
    } else
    {
      if (offNetwork && OFF_NETWORK_ALLOWLIST_ACTIONS.includes('WARN')) {
        console.log(`${req.user.username} has accessed service from an IP address outside of the allowlist: [${device}]`)
      }
      if (badDevice && DISALLOWED_DEVICES_ACTIONS.includes('WARN')) {
        console.log(`${req.user.username} has accessed service from a disallowed device: ${device}`)
      }
    }

    //Do any reporting to Sentry we need to, but only one report
    if (offNetwork && badDevice) {
      if (
        OFF_NETWORK_ALLOWLIST_ACTIONS.includes('REPORT_IF_BAD_DEVICE') ||
        OFF_NETWORK_ALLOWLIST_ACTIONS.includes('REPORT') ||
        DISALLOWED_DEVICES_ACTIONS.includes('REPORT_IF_OFF_NETWORK') ||
        DISALLOWED_DEVICES_ACTIONS.includes('REPORT')
      ) {
        Sentry.captureException(new Error('User access from outside of allowlist on disallowed device'))
      }
    } else {

      if (offNetwork && OFF_NETWORK_ALLOWLIST_ACTIONS.includes('REPORT')) {
        Sentry.captureException(new Error('User access from outside of allowlist'))
      }
      if (badDevice && DISALLOWED_DEVICES_ACTIONS.includes('REPORT')){
        Sentry.captureException(new Error('User access from disallowed device'))
      }
    }

    if (
      badDevice &&
      offNetwork &&
        (
          OFF_NETWORK_ALLOWLIST_ACTIONS.includes('ENFORCE_IF_BAD_DEVICE') ||
          DISALLOWED_DEVICES_ACTIONS.includes('ENFORCE_IF_OFF_NETWORK')
        )
      )
    {
      const error = new Error(
        'Access denied from this device and network location'
      ) as BasmError
      error.statusCode = 403
      return next(error)
    }

    if (offNetwork && OFF_NETWORK_ALLOWLIST_ACTIONS.includes('ENFORCE')) {
      const error = new Error(
        'Access denied from this network location'
      ) as BasmError
      error.statusCode = 403
      return next(error)
    }
    if (badDevice && DISALLOWED_DEVICES && DISALLOWED_DEVICES_ACTIONS.includes('ENFORCE')) {
      const error = new Error(
        'Access denied from this device'
      ) as BasmError
      error.statusCode = 403
      return next(error)
    }
  }

  next()
}

function ipAddressPermitted(ipAddress: string | undefined): boolean {
  if (OFF_NETWORK_ALLOWLIST.includes('*')) {
    return true
  }

  if (!ipAddress) {
    return false
  }
  // check their IP address against OFF_NETWORK_ALLOWLIST
  return OFF_NETWORK_ALLOWLIST.some(subnet =>
    new Netmask(subnet).contains(ipAddress!))
}
