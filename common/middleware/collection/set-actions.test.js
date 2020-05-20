const middleware = require('./set-actions')

describe('Collection middleware', function() {
  describe('#setActions()', function() {
    const mockActions = ['foo', 'bar']
    let req, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {}

      middleware(mockActions)(req, {}, nextSpy)
    })

    it('should set context on req', function() {
      expect(req).to.deep.equal({
        actions: mockActions,
      })
    })

    it('shoult call next', function() {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })
})
