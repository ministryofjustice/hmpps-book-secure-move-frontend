const proxyquire = require('proxyquire').noCallThru()

const services = {
  serviceWithoutContext: {
    method: 'service - without context',
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
      req = { session: {} }

      setServices(req, {}, next)
    })

    it('should return expected values from service functions which did not have context added', function () {
      expect(req.services.serviceWithoutContext()).to.deep.equal({
        method: 'service - without context',
      })
    })
  })
})
