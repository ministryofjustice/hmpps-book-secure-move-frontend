const proxyquire = require('proxyquire').noCallThru()

const apiClient = sinon.stub().returns({})

const setApiClient = proxyquire('./set-api-client', {
  '../lib/api-client': apiClient,
})

describe('Middleware', function () {
  describe('#setApiClient', function () {
    const next = sinon.spy()
    let req
    beforeEach(function () {
      req = { session: {} }

      setApiClient(req, {}, next)
    })

    it('should add api client object to request', function () {
      expect(req.apiClient).to.exist
    })

    it('should add context to api client', function () {
      expect(apiClient).to.be.calledWithExactly(req)
    })
  })
})
