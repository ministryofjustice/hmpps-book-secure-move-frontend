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
})
