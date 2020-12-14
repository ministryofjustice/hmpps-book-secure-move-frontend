const proxyquire = require('proxyquire')
const uuid = {
  v4: sinon.stub().returns('#uuid'),
}
const config = {
  API: {
    VERSION: 'terminator-x',
  },
  APP_VERSION: 'chuck-d',
  CUSTOM_HEADERS: {
    'X-Test-Header': 'testvalue',
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
        let req

        beforeEach(function () {
          req = {
            user: {
              username: 'T_USER',
            },
          }
          headers = getRequestHeaders(req)
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

        it('should return the `Current-User` header', function () {
          expect(headers['X-Current-User']).to.equal('T_USER')
        })

        it('should return the custom header specified in config', function () {
          expect(headers['X-Test-Header']).to.equal('testvalue')
        })
      })
    })

    context('when called with a format', function () {
      let headers
      let req

      beforeEach(function () {
        req = {}
        headers = getRequestHeaders(req, 'format/foo')
      })

      it('should return `Accept` header with specified format and the api version', function () {
        expect(headers.Accept).to.equal(
          `format/foo; version=${config.API.VERSION}`
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
    })
  })
})
