const proxyquire = require('proxyquire')

const config = {
  FEEDBACK_URL: 'https://feedback.url',
}

const middleware = proxyquire('./locals.feedback-url', {
  '../../config': config,
})

describe('Middleware', function () {
  describe('#localsFeedbackUrl', function () {
    let req
    let res
    let next

    beforeEach(function () {
      req = {}
      res = { locals: {} }
      next = sinon.spy()

      middleware(req, res, next)
    })

    it('should call next', function () {
      expect(next).to.be.calledOnceWithExactly()
    })

    it('should set FEEDBACK_URL', function () {
      expect(res.locals.FEEDBACK_URL).to.equal('https://feedback.url')
    })
  })
})
