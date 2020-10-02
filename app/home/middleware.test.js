const controllers = require('./middleware')

describe('Home middleware', function () {
  describe('movesRedirect()', function () {
    let req, res, next

    beforeEach(function () {
      req = {
        session: {
          user: {
            permissions: [],
          },
        },
      }
      res = {
        redirect: sinon.spy(),
      }
      next = sinon.spy()
    })

    context('without correct permission', function () {
      beforeEach(function () {
        controllers.movesRedirect(req, res, next)
      })

      it('should redirect', function () {
        expect(res.redirect).to.be.calledOnceWithExactly('/moves')
      })

      it('should not call next', function () {
        expect(next).to.not.be.called
      })
    })

    context('with correct permission', function () {
      beforeEach(function () {
        req.session.user.permissions = ['dashboard:view']

        controllers.movesRedirect(req, res, next)
      })

      it('should not redirect', function () {
        expect(res.redirect).to.not.be.called
      })

      it('should call next', function () {
        expect(next).to.be.calledOnce
      })
    })
  })
})
