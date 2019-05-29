const authentication = require('./authentication')
const nock = require('nock')
const { AUTH } = require('../../config')

describe('Authentication middleware', () => {
  describe('#ensureAuthenticated()', () => {
    let req, res, nextSpy

    beforeEach(() => {
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

    context('when there is no access token', () => {
      beforeEach(() => {
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('redirects to the Okta authentication URL', () => {
        expect(res.redirect).to.be.calledWith('/connect/okta')
      })

      it('sets the redirect URL in the session', () => {
        expect(req.session.postAuthRedirect).to.eq('/test')
      })
    })

    context('when the access token has expired', () => {
      beforeEach(() => {
        req.session.authExpiry = Math.floor(new Date() / 1000) - 1000
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('redirects to the Okta authentication URL', () => {
        expect(res.redirect).to.be.calledWith('/connect/okta')
      })

      it('sets the redirect URL in the session', () => {
        expect(req.session.postAuthRedirect).to.eq('/test')
      })
    })

    context('when the access token has not expired', () => {
      beforeEach(() => {
        req.session.authExpiry = Math.floor(new Date() / 1000) + 1000
        authentication.ensureAuthenticated(req, res, nextSpy)
      })

      it('calls the next action', () => {
        expect(nextSpy.calledOnce).to.be.true
      })
    })
  })

  describe('#processAuthResponse', () => {
    let req, res, nextSpy

    beforeEach(() => {
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

    context('when there is no grant response', () => {
      it('redirects to root', () => {
        authentication.processAuthResponse(req, res, nextSpy)
        expect(res.redirect).to.be.calledWith('/')
      })
    })

    context('when there is a grant response', () => {
      let accessToken, expiryTime, userInfo

      beforeEach(async () => {
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

      it('regenerates the session', async () => {
        expect(req.session.id).to.eq('456')
      })

      it('sets the auth expiry time on the session', () => {
        expect(req.session.authExpiry).to.eq(expiryTime)
      })

      it('sets the user info on the session', () => {
        expect(req.session.userInfo.test).to.eq(userInfo.test)
      })

      it('sets the redirect URL in the session', () => {
        expect(req.session.postAuthRedirect).to.eq('/test')
      })

      it('calls the next action', () => {
        expect(nextSpy.calledOnce).to.be.true
      })
    })
  })
})
