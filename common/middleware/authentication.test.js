const ensureAuthenticated = require('./authentication')

const provider = 'sso_provider'

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
        ensureAuthenticated(provider)(req, res, nextSpy)
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })

      it('should redirect to the authentication URL', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(`/connect/${provider}`)
      })

      it('should set the redirect URL in the session', function () {
        expect(req.session.postAuthRedirect).to.equal('/test')
      })
    })

    context('when the access token has expired', function () {
      beforeEach(function () {
        req.session.authExpiry = Math.floor(new Date() / 1000) - 1000
        ensureAuthenticated(provider)(req, res, nextSpy)
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })

      it('should redirect to the authentication URL', function () {
        expect(res.redirect).to.be.calledWith(`/connect/${provider}`)
      })

      it('should set the redirect URL in the session', function () {
        expect(req.session.postAuthRedirect).to.equal('/test')
      })
    })

    context('when the access token has not expired', function () {
      beforeEach(function () {
        req.session.authExpiry = Math.floor(new Date() / 1000) + 1000
        ensureAuthenticated()(req, res, nextSpy)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('shoould not redirect', function () {
        expect(res.redirect).not.to.be.called
      })
    })
  })
})
