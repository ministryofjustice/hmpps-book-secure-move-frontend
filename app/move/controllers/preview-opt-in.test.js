const proxyquire = require('proxyquire').noCallThru()

const config = {
  COOKIES: {
    MOVE_DESIGN_PREVIEW: {
      name: userId => `cookie__${userId}`,
      maxAge: 3600,
    },
  },
}
const viewConstants = {
  PREVIEW_PREFIX: '/preview-prefix',
}

const controller = proxyquire('./preview-opt-in', {
  '../app/view/constants': viewConstants,
  '../../../config': config,
})

describe('Move controllers', function () {
  describe('#previewOptIn()', function () {
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

      it('should set a cookie with value of `1`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          1,
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

      it('should set a cookie with value of `1`', function () {
        expect(res.cookie).to.have.been.calledOnceWith(
          `cookie__${req.user.userId}`,
          1,
          { maxAge: config.COOKIES.MOVE_DESIGN_PREVIEW.maxAge }
        )
      })

      it('should redirect to the move', function () {
        expect(res.redirect).to.have.been.calledOnceWith(
          `/move${viewConstants.PREVIEW_PREFIX}/${req.query.move_id}`
        )
      })
    })
  })
})
