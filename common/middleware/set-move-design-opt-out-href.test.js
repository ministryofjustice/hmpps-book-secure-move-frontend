const middleware = require('./set-move-design-opt-out-href')

describe('Middleware', function () {
  describe('#setMoveDesignOptOutHref', function () {
    let req, res, next

    beforeEach(function () {
      req = {}
      res = { locals: {} }
      next = sinon.spy()
    })

    context('when not viewing the new move design', function () {
      beforeEach(function () {
        middleware({ previewPrefix: '/preview' })(req, res, next)
      })

      it('should set moveDesignPreview to false', function () {
        expect(res.locals.moveDesignOptOutHref).to.be.null
      })

      it('should call next', function () {
        expect(next).to.be.calledOnceWithExactly()
      })
    })

    context('when viewing the new move design', function () {
      beforeEach(function () {
        req.moveDesignPreview = true
      })

      context('when there is no move', function () {
        beforeEach(function () {
          middleware({ previewPrefix: '/preview' })(req, res, next)
        })

        it('should set moveDesignPreview to false', function () {
          expect(res.locals.moveDesignOptOutHref).to.be.null
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('when the request move is set', function () {
        beforeEach(function () {
          req.move = { id: 'abc' }
          middleware({ previewPrefix: '/preview' })(req, res, next)
        })

        it('should set moveDesignPreview to false', function () {
          expect(res.locals.moveDesignOptOutHref).to.equal(
            '/move/preview/opt-out?move_id=abc'
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('when the request moveId is set', function () {
        beforeEach(function () {
          req.moveId = 'abc'
          middleware({ previewPrefix: '/preview' })(req, res, next)
        })

        it('should set moveDesignPreview to true', function () {
          expect(res.locals.moveDesignOptOutHref).to.equal(
            '/move/preview/opt-out?move_id=abc'
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
