const proxyquire = require('proxyquire').noCallThru()

const { BaseService } = require('../services/base')

class ServiceWithContext extends BaseService {
  method() {
    return 'service with context'
  }
}

const services = {
  serviceWithoutContext: {
    method: 'service - without context',
  },
  serviceWithContext: ServiceWithContext,
}

const setServices = proxyquire('./set-services', {
  '../services': services,
})

describe('Middleware', function () {
  describe('#setServices', function () {
    const next = sinon.spy()
    let req
    beforeEach(function () {
      req = { session: {}, apiClient: {} }

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

    it('should return expected values from service functions which did have context added', function () {
      expect(req.services.serviceWithContext).to.deep.equal(
        new ServiceWithContext(req)
      )
    })
  })
})
