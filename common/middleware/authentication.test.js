const authentication = require('./authentication')

describe('Authentication middleware', function () {
  describe('#ensureAuthenticated()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      req = {
        originalUrl: '/test',
        session: {
          authExpiry: null,
        },
      }
      res = {
        redirect: sinon.spy(),
      }
    })

    context('when there is no access token', function () {
      beforeEach(function () {
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('redirects to the authentication URL', function () {
        expect(res.redirect).to.be.calledWith('/connect/hmpps')
      })

      it('sets the redirect URL in the session', function () {
        expect(req.session.postAuthRedirect).to.equal('/test')
      })
    })

    context('when the access token has expired', function () {
      beforeEach(function () {
        req.session.authExpiry = Math.floor(new Date() / 1000) - 1000
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('redirects to the authentication URL', function () {
        expect(res.redirect).to.be.calledWith('/connect/hmpps')
      })

      it('sets the redirect URL in the session', function () {
        expect(req.session.postAuthRedirect).to.equal('/test')
      })
    })

    context('when the access token has not expired', function () {
      beforeEach(function () {
        req.session.authExpiry = Math.floor(new Date() / 1000) + 1000
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('calls the next action', function () {
        expect(nextSpy.calledOnce).to.be.true
      })
    })
  })

  describe('#processAuthResponse', function () {
    let req, res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()

      req = {
        session: {
          id: '123',
          postAuthRedirect: '/test',
        },
      }
      res = {
        redirect: sinon.spy(),
      }
    })

    context('when there is no grant response', function () {
      it('redirects to root', function () {
        authentication.processAuthResponse(req, res, nextSpy)
        expect(res.redirect).to.be.calledWith('/')
      })
    })

    context('when there is a grant response', function () {
      let payload, expiryTime

      beforeEach(async function () {
        expiryTime = 1000
        payload = {
          user_name: 'test',
          test: 'test',
          authorities: ['test'],
          exp: expiryTime,
        }

        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
        const accessToken = `test.${encodedPayload}.test`

        req.session.grant = {
          response: {
            access_token: accessToken,
          },
        }

        // Stub the express-session #regenerate function which takes a callback
        req.session.regenerate = (func) => {
          req.session = {
            id: '456',
          }

          func()
        }

        await authentication.processAuthResponse(req, res, nextSpy)
      })

      it('regenerates the session', async function () {
        expect(req.session.id).to.equal('456')
      })

      it('sets the auth expiry time on the session', function () {
        expect(req.session.authExpiry).to.equal(expiryTime)
      })

      it('sets the user info on the session', function () {
        expect(req.session.userInfo).to.eql({
          user_name: payload.user_name,
          authorities: payload.authorities,
        })
      })

      it('sets the redirect URL in the session', function () {
        expect(req.session.postAuthRedirect).to.equal('/test')
      })

      it('calls the next action', function () {
        expect(nextSpy.calledOnce).to.be.true
      })
    })

    context('session regeneration throws an error', function () {
      let reqMock, errorMock

      beforeEach(async function () {
        errorMock = new Error('Session Error')

        reqMock = {
          session: {
            grant: {
              response: {},
            },
            regenerate (func) {
              func(errorMock)
            },
          },
        }

        await authentication.processAuthResponse(reqMock, {}, nextSpy)
      })

      it('should call next with error', async function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy).to.be.calledWith(errorMock)
      })
    })
  })
})
