const proxyquire = require('proxyquire')

const config = {
  COOKIES: {
    MOVE_DESIGN_PREVIEW: {
      name: userId => `cookie__${userId}`,
    },
  },
}

const middleware = proxyquire('./set-move-design-preview', {
  '../../config': config,
})

describe('Middleware', function () {
  describe('#setMoveDesignPreview', function () {
    let req
    let res
    let next

    beforeEach(function () {
      req = { user: { userId: 10 } }
      res = { locals: {} }
      next = sinon.spy()
    })

    context('when the user is seeing the new design', function () {
      beforeEach(function () {
        req.cookies = { cookie__10: '1' }
        middleware(req, res, next)
      })

      it('should set moveDesignPreview to false', function () {
        expect(req.moveDesignPreview).to.be.true
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    context("when the user isn't seeing the new design", function () {
      beforeEach(function () {
        req.cookies = { cookie__10: '0' }
        middleware(req, res, next)
      })

      it('should set moveDesignPreview to true', function () {
        expect(req.moveDesignPreview).to.be.false
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })
  })
})
