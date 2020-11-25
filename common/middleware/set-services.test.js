const proxyquire = require('proxyquire').noCallThru()

const services = {
  foo: {
    addRequestContext: sinon.stub().returns({ method: 'foo - with context' }),
  },
  bar: {
    method: 'bar - without context',
  },
}

const setServices = proxyquire('./set-services', {
  '../services': services,
})

describe('Middleware', function () {
  describe('#setServices', function () {
    const next = sinon.spy()
    let req
    beforeEach(function () {
      req = {}
      services.foo.addRequestContext.resetHistory()

      setServices(req, {}, next)
    })

    it('should add context to service', function () {
      expect(services.foo.addRequestContext).to.be.calledOnceWithExactly(req)
    })

    it('should add services object to request', function () {
      expect(req.services).to.exist
    })

    it('should add service functions to services', function () {
      expect(Object.keys(req.services)).to.deep.equal(['foo', 'bar'])
    })

    it('should return expected values from service functions which had context added', function () {
      expect(req.services.foo()).to.deep.equal({ method: 'foo - with context' })
    })

    it('should return same values from service functions which had context added', function () {
      expect(req.services.foo()).to.equal(req.services.foo())
    })

    it('should return expected values from service functions which did not have context added', function () {
      expect(req.services.bar()).to.deep.equal({
        method: 'bar - without context',
      })
    })

    it('should return same values from service functions which did not have context added', function () {
      expect(req.services.bar()).to.deep.equal(req.services.bar())
    })
  })
})
