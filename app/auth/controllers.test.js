const proxyquire = require('proxyquire').noCallThru()

const logOutUrl = 'http://test/test'
const mockConfig = {
  AUTH_PROVIDERS: {
    test: {
      logout_url: logOutUrl,
    },
  },
  DEFAULT_AUTH_PROVIDER: 'test',
}

const controllers = proxyquire('./controllers', {
  '../../config': mockConfig,
})

const url = '/test'

describe('Authentication app', function () {
  describe('#redirect()', function () {
    let req, res

    beforeEach(function () {
      req = { session: {} }
      res = {
        redirect: sinon.spy(),
      }
    })

    context('when redirect URL exists in session', function () {
      beforeEach(function () {
        req.session.originalRequestUrl = url
        controllers.redirect(req, res)
      })

      it('redirects to the session URL', function () {
        expect(res.redirect).to.be.calledWith(url)
      })

      it('unsets session.originalRequestUrl', function () {
        expect(req.session.originalRequestUrl).to.equal(null)
      })
    })

    context('when redirect URL doesn’t exists in session', function () {
      beforeEach(function () {
        controllers.redirect(req, res)
      })

      it('redirects to the route path', function () {
        expect(res.redirect).to.be.calledWith('/')
      })

      it('unsets session.originalRequestUrl', function () {
        expect(req.session.originalRequestUrl).to.equal(null)
      })
    })
  })

  describe('#signOut()', function () {
    let req, res

    beforeEach(function () {
      req = {
        query: {},
        session: {
          destroy: callback => callback(),
        },
      }
      res = {
        redirect: sinon.spy(),
      }
      sinon.spy(req.session, 'destroy')

      controllers.signOut(req, res)
    })

    it('destroys the session', function () {
      expect(req.session.destroy).to.be.called
    })

    it('redirects to the auth provider logout URL', function () {
      expect(res.redirect).to.be.calledWith(logOutUrl)
    })
  })
})
