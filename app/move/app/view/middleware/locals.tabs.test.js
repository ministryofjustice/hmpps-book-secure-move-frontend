const middleware = require('./locals.tabs')

describe('Move view app', function () {
  describe('Middleware', function () {
    describe('#localsTabs()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          baseUrl: '/base-url',
          originalUrl: '/',
        }
        res = {
          locals: {},
        }
        nextSpy = sinon.spy()

        middleware(req, res, nextSpy)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
