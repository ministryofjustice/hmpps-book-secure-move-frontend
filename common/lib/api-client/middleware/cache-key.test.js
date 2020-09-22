const proxyquire = require('proxyquire')

const mockModels = {
  cachedModel: {
    options: {
      cache: true,
    },
  },
}

const middleware = proxyquire('./cache-key', {
  '../models': mockModels,
})

const mockResponse = {
  data: {
    foo: 'bar',
  },
}

const defaultPayload = {
  jsonApi: {
    axios: sinon.stub().resolves(mockResponse),
  },
  req: {
    url: 'http://localhost:3030/path/to/endpoint',
    method: 'GET',
    params: {},
  },
}

describe('API Client', function () {
  describe('Cache key middleware', function () {
    describe('#cache-key', function () {
      let expectedPayload
      let payload
      beforeEach(function () {
        payload = {
          ...defaultPayload,
        }
        expectedPayload = { ...payload }
      })

      context('when model should not be cached', function () {
        it('should leave payload untouched', function () {
          middleware().req(payload)
          expect(payload).to.deep.equal(expectedPayload)
        })
      })

      context('when model should be cached', function () {
        beforeEach(function () {
          payload = {
            ...defaultPayload,
          }
          payload.req = {
            ...payload.req,
            model: 'cachedModel',
          }
          expectedPayload = {
            ...payload,
            cacheKey: 'cache:v2:GET./path/to/endpoint',
          }
        })
        it('should add cacheKey to payload', function () {
          middleware().req(payload)
          expect(payload).to.deep.equal(expectedPayload)
        })

        context('and api version is set explicitly', function () {
          beforeEach(function () {
            expectedPayload = {
              ...payload,
              cacheKey: 'cache:v99:GET./path/to/endpoint',
            }
          })
          it('should add cacheKey containing api version to payload', function () {
            middleware({ apiVersion: 99 }).req(payload)
            expect(payload).to.deep.equal(expectedPayload)
          })
        })

        context('but cache param is false', function () {
          beforeEach(function () {
            payload.req.params = {
              ...payload.req.params,
              cache: false,
            }
            expectedPayload = { ...payload }
          })
          it('should leave payload untouched', function () {
            middleware().req(payload)
            expect(payload).to.deep.equal(expectedPayload)
          })
        })
      })
    })
  })
})
