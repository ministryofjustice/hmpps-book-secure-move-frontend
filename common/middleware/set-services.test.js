const proxyquire = require('proxyquire').noCallThru()

const services = {
  serviceWithoutContext: {
    method: 'service - without context',
  },
  serviceWithContext: sinon
    .stub()
    .returns({ method: 'service - with context' }),
}

const setServices = proxyquire('./set-services', {
  '../services': services,
})

describe('Middleware', function () {
  describe('#setServices', function () {
    const next = sinon.spy()
    let req
    beforeEach(function () {
      req = { session: {} }

      setServices(req, {}, next)
    })

    it('should add services object to request', function () {
      expect(req.services).to.exist
    })

    it('should return expected values from service functions which did not have context added', function () {
      expect(req.services.serviceWithoutContext).to.deep.equal({
        method: 'service - without context',
      })
    })

    it('should add context to service', function () {
      expect(services.serviceWithContext).to.be.calledWithExactly(req)
    })

    it('should return expected values from service functions which have context added', function () {
      expect(req.services.serviceWithContext).to.deep.equal({
        method: 'service - with context',
      })
    })
  })
})
