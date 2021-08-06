const proxyquire = require('proxyquire').noCallThru()

const config = {
  COOKIES: {
    MOVE_DESIGN_PREVIEW: {
      name: userId => `cookie__${userId}`,
      maxAge: 3600,
    },
  },
}

const controller = proxyquire('./preview-opt-out', {
  '../../../config': config,
})

describe('Move controllers', function () {
  describe('#previewOptOut()', function () {
    let req, res

    beforeEach(function () {
      req = {
        query: {},
        user: {
          userId: 'user_1',
        },
      }
      res = {
        cookie: sinon.spy(),
        redirect: sinon.spy(),
      }
    })

    context('without move ID', function () {
      beforeEach(function () {
        controller(req, res)
      })

      it('should set a cookie with value of `0`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          0,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should redirect to the homepage', function () {
        expect(res.redirect).to.have.been.calledOnceWith('/')
      })
    })

    context('with move ID', function () {
      beforeEach(function () {
        req.query.move_id = 'AAA-BBB-CCC-111'
        controller(req, res)
      })

      it('should set a cookie with value of `0`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          0,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should redirect to the move', function () {
        expect(res.redirect).to.have.been.calledOnceWith(
          `/move/${req.query.move_id}`
        )
      })
    })
  })
})
