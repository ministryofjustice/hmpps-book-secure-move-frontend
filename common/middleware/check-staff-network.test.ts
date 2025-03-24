import { expect } from 'chai'
import { DeepPartial } from 'fishery'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { BasmRequest } from '../types/basm_request'

const { encodeAccessToken } = require('../lib/access-token')

const checkStaffNetwork = proxyquire('./check-staff-network', {
  '../../config': {
    OFF_NETWORK_ALLOWLIST: ['500.0.0.1'],
  },
}).default

describe('checkStaffNetwork', function () {
  let req: DeepPartial<BasmRequest>

  beforeEach(function () {
    req = {
      connection: {
        remoteAddress: '500.0.0.1',
      },
      session: {},
      url: '/',
    }
  })

  describe('when there is an authenticated session', function () {
    let accessToken: { auth_source?: string }

    beforeEach(function () {
      accessToken = {}
      req = {
        connection: {
          remoteAddress: '500.0.0.1',
        },
        session: {
          grant: {
            response: {
              access_token: encodeAccessToken(accessToken),
            },
          },
        },
        url: '/',
      }
    })

    context('when the auth_source is "nomis"', function () {
      beforeEach(function () {
        accessToken.auth_source = 'nomis'
        req.session!.grant.response.access_token =
          encodeAccessToken(accessToken)
      })

      context('when the ip is in the OFF_NETWORK_ALLOWLIST', function () {
        it('calls next', function () {
          const next = sinon.stub()
          checkStaffNetwork(req, 'res', next)
          expect(next).to.be.calledOnceWithExactly()
        })

        context('when the ip is ipv6', function () {
          beforeEach(function () {
            req.connection!.remoteAddress = '::ffff:500.0.0.1'
          })

          it('calls next', function () {
            const next = sinon.stub()
            checkStaffNetwork(req, 'res', next)
            expect(next).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when the ip is not in the OFF_NETWORK_ALLOWLIST', function () {
        beforeEach(function () {
          req.connection!.remoteAddress = '123.123.123.123'
        })

        it('calls next with an error', function () {
          const next = sinon.stub()
          checkStaffNetwork(req, 'res', next)
          expect(next).to.be.calledOnce
          expect(next.args[0][0].toString()).to.equal(
            'Error: Access denied from this network location'
          )
          expect(next.args[0][0].statusCode).to.equal(403)
        })

        context('when the ip is ipv6', function () {
          beforeEach(function () {
            req.connection!.remoteAddress = '::ffff:123.123.123.123'
          })

          it('calls next with an error', function () {
            const next = sinon.stub()
            checkStaffNetwork(req, 'res', next)
            expect(next).to.be.calledOnce
            expect(next.args[0][0].toString()).to.equal(
              'Error: Access denied from this network location'
            )
            expect(next.args[0][0].statusCode).to.equal(403)
          })
        })
      })
    })

    context('when the auth_source is "auth"', function () {
      beforeEach(function () {
        accessToken.auth_source = 'auth'
        req.session!.grant.response.access_token =
          encodeAccessToken(accessToken)
      })

      context('when the ip is in the OFF_NETWORK_ALLOWLIST', function () {
        it('calls next', function () {
          const next = sinon.stub()
          checkStaffNetwork(req, 'res', next)
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('when the ip is not in the OFF_NETWORK_ALLOWLIST', function () {
        beforeEach(function () {
          req.connection!.remoteAddress = '123.123.123.123'
        })

        it('calls next', function () {
          const next = sinon.stub()
          checkStaffNetwork(req, 'res', next)
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
