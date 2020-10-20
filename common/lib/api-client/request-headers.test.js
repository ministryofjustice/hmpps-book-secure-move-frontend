const proxyquire = require('proxyquire')
const uuid = {
  v4: sinon.stub().returns('#uuid'),
}
const config = {
  API: {
    VERSION: 'terminator-x',
  },
  APP_VERSION: 'chuck-d',
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

        it('should return the `User-Agent` header', function () {
          expect(headers['User-Agent']).to.equal(
            'hmpps-book-secure-move-frontend/chuck-d'
          )
        })

        it('should return the `Accept-Encoding` header', function () {
          expect(headers['Accept-Encoding']).to.equal('gzip')
        })

        it('should return the `Idempotency-Key` header', function () {
          expect(headers['Idempotency-Key']).to.equal('#uuid')
        })

        it('should return the `X-Transaction-Id` header', function () {
          expect(headers['X-Transaction-Id']).to.equal('auto-#uuid')
        })
      })
    })

    context('when called with a format', function () {
      let headers

      beforeEach(function () {
        headers = getRequestHeaders({ format: 'format/foo' })
      })

      it('should return `Accept` header with specified format and the api version', function () {
        expect(headers.Accept).to.equal(
          `format/foo; version=${config.API.VERSION}`
        )
      })
    })

    context('when called with a request', function () {
      let headers

      beforeEach(function () {
        headers = getRequestHeaders({
          req: { transactionId: '#transactionId' },
        })
      })

      it('should return the `Idempotency-Key` header', function () {
        expect(headers['Idempotency-Key']).to.equal('#uuid')
      })

      it('should return req’s transactionId as the `X-Transaction-Id` header', function () {
        expect(headers['X-Transaction-Id']).to.equal('#transactionId')
      })
    })
  })
})
