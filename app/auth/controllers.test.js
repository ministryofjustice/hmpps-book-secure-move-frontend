const controllers = require('./controllers')

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
        req.session.postAuthRedirect = url
        controllers.redirect(req, res)
      })

      it('redirects to the session URL', function () {
        expect(res.redirect).to.be.calledWith(url)
      })

      it('unsets session.postAuthRedirect', function () {
        expect(req.session.postAuthRedirect).to.equal(null)
      })
    })

    context('when redirect URL doesn\'t exists in session', function () {
      beforeEach(function () {
        controllers.redirect(req, res)
      })

      it('redirects to the route path', function () {
        expect(res.redirect).to.be.calledWith('/')
      })

      it('unsets session.postAuthRedirect', function () {
        expect(req.session.postAuthRedirect).to.equal(null)
      })
    })
  })
})
