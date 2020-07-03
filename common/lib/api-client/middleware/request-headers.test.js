const proxyquire = require('proxyquire')
const uuid = {
  v4: sinon.stub().returns('#uuid'),
}
const config = {
  API: {
    VERSION: 'terminator-x',
  },
}

const middleware = proxyquire('./request-headers', {
  uuid,
  '../../../../config': config,
})

describe('API Client', function () {
  describe('Request headers middleware', function () {
    describe('#req-headers', function () {
      context('when payload does not include a request', function () {
        it('should return default payload', function () {
          expect(middleware.req()).to.deep.equal({})
        })
      })

      context('when payload contains a request', function () {
        let request

        beforeEach(function () {
          request = {
            headers: {
              Accept: 'Something',
            },
          }
          middleware.req({ req: request })
        })

        it('should append the `Accept` header with the api version', function () {
          expect(request.headers.Accept).to.equal(
            `Something; version=${config.API.VERSION}`
          )
        })

        it('should add the `Idempotency-Key` header', function () {
          expect(request.headers['Idempotency-Key']).to.equal('#uuid')
        })
      })
    })
  })
})
