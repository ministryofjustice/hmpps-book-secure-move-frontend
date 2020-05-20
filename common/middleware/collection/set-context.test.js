const middleware = require('./set-context')

describe('Collection middleware', function() {
  describe('#setContext()', function() {
    const mockContext = 'mockContext'
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {}

      middleware(mockContext)(req, {}, nextSpy)
    })

    it('should set context on req', function() {
      expect(req).to.deep.equal({
        context: mockContext,
      })
    })

    it('shoult call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
