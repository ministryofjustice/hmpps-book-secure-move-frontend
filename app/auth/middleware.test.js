const proxyquire = require('proxyquire')

const userFailureError = new Error('test')
const userSuccessStub = {
  getLocations: () => Promise.resolve(['TEST']),
  getFullname: () => Promise.resolve('Mr Benn'),
  getSupplierId: () => Promise.resolve('2ae52e8c-928d-4826-8b7e-56042b35de35'),
}
const userLocationsFailureStub = {
  getLocations: () => Promise.reject(userFailureError),
  getFullname: () => Promise.resolve('Mr Benn'),
  getSupplierId: () => Promise.resolve('2ae52e8c-928d-4826-8b7e-56042b35de35'),
}
const userFullNameFailureStub = {
  getLocations: () => Promise.resolve(['TEST']),
  getFullname: () => Promise.reject(userFailureError),
  getSupplierId: () => Promise.resolve('2ae52e8c-928d-4826-8b7e-56042b35de35'),
}
const supplierIdFailureStub = {
  getLocations: () => Promise.resolve(['TEST']),
  getFullname: () => Promise.resolve('Mr Benn'),
  getSupplierId: () => Promise.reject(userFailureError),
}
function UserStub({ fullname, roles = [], locations = [], supplierId } = {}) {
  this.fullname = fullname
  this.permissions = []
  this.locations = locations
  this.supplierId = supplierId
}

const expiryTime = 1000
const payload = {
  user_name: 'test',
  test: 'test',
  authorities: ['test'],
  exp: expiryTime,
}
const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')

describe('Authentication middleware', function() {
  describe('#processAuthResponse', function() {
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        session: {
          id: '123',
          postAuthRedirect: '/test',
          regenerate: sinon.stub(),
        },
      }
    })

    context('when there is no grant response', function() {
      beforeEach(async function() {
        const authentication = proxyquire('./middleware', {
          '../../common/lib/user': UserStub,
          '../../common/services/user': userSuccessStub,
        })

        await authentication.processAuthResponse()(req, {}, nextSpy)
      })

      it('returns next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('doesn’t regenerate the session', function() {
        expect(req.session.regenerate).not.to.be.called
      })
    })

    context('when there is a grant response', function() {
      beforeEach(function() {
        req.session.grant = {
          response: {
            access_token: `test.${encodedPayload}.test`,
          },
        }
      })

      context('when the user locations lookup fails', function() {
        beforeEach(async function() {
          const authentication = proxyquire('./middleware', {
            '../../common/services/user': userLocationsFailureStub,
          })

          await authentication.processAuthResponse()(req, {}, nextSpy)
        })

        it('returns next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(userFailureError)
        })
      })

      context('when the user fullname lookup fails', function() {
        beforeEach(async function() {
          const authentication = proxyquire('./middleware', {
            '../../common/lib/user': UserStub,
            '../../common/services/user': userFullNameFailureStub,
          })

          await authentication.processAuthResponse()(req, {}, nextSpy)
        })

        it('calls with with error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(userFailureError)
        })

        it('doesn’t regenerate the session', function() {
          expect(req.session.regenerate).not.to.be.called
        })
      })

      context('when the supplier id lookup fails', function() {
        beforeEach(async function() {
          const authentication = proxyquire('./middleware', {
            '../../common/services/user': supplierIdFailureStub,
          })

          await authentication.processAuthResponse()(req, {}, nextSpy)
        })

        it('returns next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(userFailureError)
        })
      })

      context('when the user locations lookup succeeds', function() {
        let authentication

        beforeEach(function() {
          authentication = proxyquire('./middleware', {
            '../../common/lib/user': UserStub,
            '../../common/services/user': userSuccessStub,
          })
        })

        context('when session regeneration throws an error', function() {
          const errorMock = new Error('Session Error')

          beforeEach(async function() {
            req.session.regenerate = callback => callback(errorMock)
            await authentication.processAuthResponse()(req, {}, nextSpy)
          })

          it('should call next with error', function() {
            expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
          })
        })

        context('when session regenerates successfully', function() {
          beforeEach(async function() {
            // Stub the express-session #regenerate function which takes a callback
            req.session.regenerate = callback => {
              req.session = {
                id: '456',
              }
              callback()
            }

            await authentication.processAuthResponse()(req, {}, nextSpy)
          })

          it('regenerates the session', function() {
            expect(req.session.id).to.equal('456')
          })

          it('sets the auth expiry time on the session', function() {
            expect(req.session.authExpiry).to.equal(expiryTime)
          })

          it('sets the user info on the session', function() {
            expect(Array.isArray(req.session.user.permissions)).to.be.true
            expect(req.session.user.locations).to.deep.equal(['TEST'])
            expect(req.session.user.fullname).to.equal('Mr Benn')
          })

          it('sets the redirect URL in the session', function() {
            expect(req.session.postAuthRedirect).to.equal('/test')
          })

          it('calls the next action', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })
  })
})
