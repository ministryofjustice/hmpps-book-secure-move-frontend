const proxyquire = require('proxyquire')

function UserStub (token) {
  this.user_name = token.user_name
}

const authentication = proxyquire('./middleware', {
  '../../common/lib/user': UserStub,
})

const expiryTime = 1000
const payload = {
  user_name: 'test',
  test: 'test',
  authorities: ['test'],
  exp: expiryTime,
}
const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')

describe('Authentication middleware', function () {
  describe('#processAuthResponse', function () {
    let req, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      req = {
        session: {
          id: '123',
          postAuthRedirect: '/test',
          regenerate: sinon.stub(),
        },
      }
    })

    context('when there is no grant response', function () {
      beforeEach(function () {
        authentication.processAuthResponse(req, {}, nextSpy)
      })

      it('returns next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it("doesn't regenerate the session", function () {
        expect(req.session.regenerate).not.to.be.called
      })
    })

    context('when there is a grant response', function () {
      beforeEach(function () {
        req.session.grant = {
          response: {
            access_token: `test.${encodedPayload}.test`,
          },
        }
      })

      context('when session regeneration throws an error', function () {
        const errorMock = new Error('Session Error')

        beforeEach(function () {
          req.session.regenerate = callback => callback(errorMock)
          authentication.processAuthResponse(req, {}, nextSpy)
        })

        it('should call next with error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })
      })

      context('when session regenerates successfully', function () {
        beforeEach(function () {
          // Stub the express-session #regenerate function which takes a callback
          req.session.regenerate = callback => {
            req.session = {
              id: '456',
            }
            callback()
          }

          authentication.processAuthResponse(req, {}, nextSpy)
        })

        it('regenerates the session', function () {
          expect(req.session.id).to.equal('456')
        })

        it('sets the auth expiry time on the session', function () {
          expect(req.session.authExpiry).to.equal(expiryTime)
        })

        it('sets the user info on the session', function () {
          expect(req.session.user).to.deep.equal({
            user_name: payload.user_name,
          })
        })

        it('sets the redirect URL in the session', function () {
          expect(req.session.postAuthRedirect).to.equal('/test')
        })

        it('calls the next action', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
