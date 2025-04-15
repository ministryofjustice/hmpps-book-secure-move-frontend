import { expect } from 'chai'
import { DeepPartial } from 'fishery'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { BasmRequest } from '../types/basm_request'

const { encodeAccessToken } = require('../lib/access-token')

const checkStaffNetwork = proxyquire('./check-staff-network', {
  '../../config': {
    OFF_NETWORK_ALLOWLIST: [
      '123.123.123.42/32',
      '100.100.100.0/24',
      '10.10.10.0/29',
    ],
  },
}).default

describe('checkStaffNetwork', function () {
  let req: DeepPartial<BasmRequest>

  beforeEach(function () {
    req = {
      connection: {
        remoteAddress: '123.123.123.42',
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
          remoteAddress: '123.123.123.42',
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
            req.connection!.remoteAddress = '::ffff:123.123.123.42'
          })

          it('calls next', function () {
            const next = sinon.stub()
            checkStaffNetwork(req, 'res', next)
            expect(next).to.be.calledOnceWithExactly()
          })
        })

        context('when the ip is /24 subnet', function () {
          it('calls next', function () {
            const next = sinon.stub()

            for (let i = 1; i < 255; i++) {
              req.connection!.remoteAddress = `::ffff:100.100.100.${i}`
              checkStaffNetwork(req, 'res', next)
              expect(next).to.be.calledOnceWithExactly()
              next.reset()
            }
          })
        })

        context('when the ip is /29 subnet', function () {
          it('calls next', function () {
            const next = sinon.stub()

            for (let i = 1; i < 8; i++) {
              req.connection!.remoteAddress = `::ffff:10.10.10.${i}`
              checkStaffNetwork(req, 'res', next)
              expect(next).to.be.calledOnceWithExactly()
              next.reset()
            }
          })
        })
      })

      context('when the ip is not in the OFF_NETWORK_ALLOWLIST', function () {
        beforeEach(function () {
          req.connection!.remoteAddress = '1.1.1.1'
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
            req.connection!.remoteAddress = '::ffff:1.1.1.1'
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

        context('when the ip is /29 subnet', function () {
          it('calls next', function () {
            const next = sinon.stub()

            for (let i = 8; i < 255; i++) {
              req.connection!.remoteAddress = `::ffff:10.10.10.${i}`
              checkStaffNetwork(req, 'res', next)
              expect(next).to.be.calledOnce
              expect(next.args[0][0].toString()).to.equal(
                'Error: Access denied from this network location'
              )
              expect(next.args[0][0].statusCode).to.equal(403)
              next.reset()
            }
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
          req.connection!.remoteAddress = '1.1.1.1'
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
