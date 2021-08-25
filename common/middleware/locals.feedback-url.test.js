const proxyquire = require('proxyquire')

const config = {
  FEEDBACK_URL: 'https://feedback.url',
  COOKIES: {
    MOVE_DESIGN_PREVIEW: {
      name: userId => `cookie__${userId}`,
    },
  },
}

describe('Middleware', function () {
  describe('#localsFeedbackUrl', function () {
    let req
    let res
    let next
    let middleware

    beforeEach(function () {
      req = { user: { userId: 10 } }
      res = { locals: {} }
      next = sinon.spy()
    })

    function optIn() {
      req.cookies = { cookie__10: '1' }
      middleware(req, res, next)
    }

    function optOut() {
      req.cookies = { cookie__10: '0' }
      middleware(req, res, next)
    }

    context('without a move preview feedback URL set', function () {
      beforeEach(function () {
        middleware = proxyquire('./locals.feedback-url', {
          '../../config': config,
        })
      })

      context("when the user isn't opted in to the new design", function () {
        beforeEach(optOut)

        it('should set FEEDBACK_URL', function () {
          expect(res.locals.FEEDBACK_URL).to.equal('https://feedback.url')
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('when the user is opted in to the new design', function () {
        beforeEach(optIn)

        it('should set FEEDBACK_URL', function () {
          expect(res.locals.FEEDBACK_URL).to.equal('https://feedback.url')
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })

    context('with a move preview feedback URL set', function () {
      beforeEach(function () {
        const configWithFeedbackUrl = {
          ...config,
          MOVE_DESIGN_FEEDBACK_URL: 'https://move.preview.feedback.url',
        }

        middleware = proxyquire('./locals.feedback-url', {
          '../../config': configWithFeedbackUrl,
        })
      })

      context("when the user isn't opted in to the new design", function () {
        beforeEach(optOut)

        it('should set FEEDBACK_URL', function () {
          expect(res.locals.FEEDBACK_URL).to.equal('https://feedback.url')
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('when the user is opted in to the new design', function () {
        beforeEach(optIn)

        it('should set MOVE_PREVIEW_FEEDBACK_URL', function () {
          expect(res.locals.FEEDBACK_URL).to.equal(
            'https://move.preview.feedback.url'
          )
        })

        it('should call next', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })
  })
})
