const proxyquire = require('proxyquire')

function MockAPIClient() {}

const BaseService = proxyquire('./base', {
  '../lib/api-client': MockAPIClient,
})

describe('Base Service', function () {
  describe('Instantiation', function () {
    let service

    context('with request', function () {
      function MockClient() {}

      const mockReq = {
        apiClient: new MockClient(),
      }

      beforeEach(function () {
        service = new BaseService(mockReq)
      })

      it('should set passed in client', function () {
        expect(service.apiClient).to.be.instanceOf(MockClient)
      })

      it('should set request to passed in value', function () {
        expect(service.req).to.deep.equal(mockReq)
      })
    })

    context('without request', function () {
      beforeEach(function () {
        service = new BaseService()
      })

      it('should set default client', function () {
        expect(service.apiClient).to.be.instanceOf(MockAPIClient)
      })

      it('should set request empty object', function () {
        expect(service.req).to.deep.equal({})
      })
    })
  })

  describe('#removeInvalid', function () {
    let service

    beforeEach(function () {
      service = new BaseService()
    })

    it('should remove invalid values', function () {
      expect(
        service.removeInvalid({
          empty_string: '',
          empty_array: [],
          empty_object: {},
          undefined,
          valid_false: false,
          valid_true: true,
          valid_string: 'foo',
          valid_object: { foo: 'bar' },
          valid_array: ['foo', 'bar'],
        })
      ).to.deep.equal({
        valid_false: false,
        valid_true: true,
        valid_string: 'foo',
        valid_object: { foo: 'bar' },
        valid_array: ['foo', 'bar'],
      })
    })
  })
})
