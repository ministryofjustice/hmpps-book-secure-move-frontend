const authentication = require('./authentication')
const nock = require('nock')
const { AUTH } = require('../../config')

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

      it('redirects to the Okta authentication URL', function () {
        expect(res.redirect).to.be.calledWith('/connect/okta')
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

      it('redirects to the Okta authentication URL', function () {
        expect(res.redirect).to.be.calledWith('/connect/okta')
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
      let accessToken, expiryTime, userInfo

      beforeEach(async function () {
        accessToken = 'test'
        expiryTime = 1000
        userInfo = {
          test: 'test',
        }

        req.session.grant = {
          response: {
            access_token: accessToken,
            id_token: {
              payload: {
                exp: expiryTime,
              },
            },
          },
        }

        // Stub the express-session #regenerate function which takes a callback
        req.session.regenerate = (func) => {
          req.session = {
            id: '456',
          }

          func()
        }

        // Stub the Okta userinfo endpoint
        nock(`https://${AUTH.OKTA_SUBDOMAIN}.okta.com`)
          .get('/oauth2/v1/userinfo')
          .reply(200, userInfo)

        await authentication.processAuthResponse(req, res, nextSpy)
      })

      it('regenerates the session', async function () {
        expect(req.session.id).to.equal('456')
      })

      it('sets the auth expiry time on the session', function () {
        expect(req.session.authExpiry).to.equal(expiryTime)
      })

      it('sets the user info on the session', function () {
        expect(req.session.userInfo.test).to.equal(userInfo.test)
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

        // Stub the Okta userinfo endpoint
        nock(`https://${AUTH.OKTA_SUBDOMAIN}.okta.com`)
          .get('/oauth2/v1/userinfo')
          .reply(200, {})

        await authentication.processAuthResponse(reqMock, {}, nextSpy)
      })

      it('should call next with error', async function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy).to.be.calledWith(errorMock)
      })
    })

    context('when async response throws an error', function () {
      let reqMock, errorMock

      beforeEach(async function () {
        errorMock = 'Mock Error'

        reqMock = {
          session: {
            grant: {
              response: {},
            },
          },
        }

        // Stub the Okta userinfo endpoint
        nock(`https://${AUTH.OKTA_SUBDOMAIN}.okta.com`)
          .get('/oauth2/v1/userinfo')
          .replyWithError(errorMock)

        await authentication.processAuthResponse(reqMock, res, nextSpy)
      })

      it('should call next with error', async function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.args[0][0].message).to.equal(errorMock)
      })
    })
  })
})
