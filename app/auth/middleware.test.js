const proxyquire = require('proxyquire')

const userLocationSuccessStub = {
  getUserLocations: () => {
    return Promise.resolve(['TEST'])
  },
}
const userLocationFailureError = new Error('test')
const userLocationFailureStub = {
  getUserLocations: () => {
    return Promise.reject(userLocationFailureError)
  },
}

function UserStub({ name, roles = [], locations = [] } = {}) {
  this.userName = name
  this.permissions = []
  this.locations = locations
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
          '../../common/services/user-locations': userLocationSuccessStub,
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
            '../../common/lib/user': UserStub,
            '../../common/services/user-locations': userLocationFailureStub,
          })

          await authentication.processAuthResponse()(req, {}, nextSpy)
        })

        it('returns next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(userLocationFailureError)
        })
      })

      context('when the user locations lookup succeeds', function() {
        let authentication

        beforeEach(function() {
          authentication = proxyquire('./middleware', {
            '../../common/lib/user': UserStub,
            '../../common/services/user-locations': userLocationSuccessStub,
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
            expect(req.session.user.userName).to.equal('test')
            expect(Array.isArray(req.session.user.permissions)).to.be.true
            expect(req.session.user.locations).to.deep.equal(['TEST'])
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
