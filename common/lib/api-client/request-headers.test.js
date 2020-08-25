const proxyquire = require('proxyquire')
const uuid = {
  v4: sinon.stub().returns('#uuid'),
}
const config = {
  API: {
    VERSION: 'terminator-x',
  },
}

const getRequestHeaders = proxyquire('./request-headers', {
  uuid,
  '../../../config': config,
})

describe('API Client', function () {
  describe('Request headers utility', function () {
    describe('#getRequestHeaders', function () {
      context('when called without a format', function () {
        let headers

        beforeEach(function () {
          headers = getRequestHeaders()
        })

        it('should return `Accept` header with default format and the api version', function () {
          expect(headers.Accept).to.equal(
            `application/vnd.api+json; version=${config.API.VERSION}`
          )
        })

        it('should return the `Idempotency-Key` header', function () {
          expect(headers['Idempotency-Key']).to.equal('#uuid')
        })
      })
    })

    context('when called with a format', function () {
      let headers

      beforeEach(function () {
        headers = getRequestHeaders('format/foo')
      })

      it('should return `Accept` header with specified format and the api version', function () {
        expect(headers.Accept).to.equal(
          `format/foo; version=${config.API.VERSION}`
        )
      })

      it('should return the `Idempotency-Key` header', function () {
        expect(headers['Idempotency-Key']).to.equal('#uuid')
      })
    })
  })
})
