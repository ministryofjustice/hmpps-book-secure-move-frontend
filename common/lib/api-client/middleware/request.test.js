const proxyquire = require('proxyquire').noPreserveCache()

const cache = {
  set: sinon.stub(),
}

const clientMetrics = {
  start: sinon.stub(),
  stop: sinon.stub(),
  stopWithError: sinon.stub(),
}

const requestMiddleware = proxyquire('./request', {
  '../cache': cache,
  '../client-metrics': clientMetrics,
})

const mockResponse = {
  data: {
    foo: 'bar',
  },
}

describe('API Client', function () {
  describe('Request middleware', function () {
    let payload
    let response
    const clientInstrumentation = {}

    beforeEach(function () {
      payload = {
        jsonApi: {
          axios: sinon.stub().resolves(mockResponse),
        },
        req: {
          url: 'http://localhost:3030/path/to/endpoint',
          method: 'GET',
          params: {},
        },
      }

      cache.set.resetHistory()
      clientMetrics.start.resetHistory()
      clientMetrics.start.returns(clientInstrumentation)
      clientMetrics.stop.resetHistory()
      clientMetrics.stopWithError.resetHistory()
    })

    context('when calling api endpoint', function () {
      beforeEach(async function () {
        response = await requestMiddleware().req(payload)
      })

      it('should make request using axios library with payload', function () {
        expect(payload.jsonApi.axios).to.be.calledOnceWithExactly(payload.req)
      })

      it('should return response', function () {
        expect(response).to.deep.equal(mockResponse)
      })

      it('should start recording metrics for the call', function () {
        expect(clientMetrics.start).to.be.calledOnceWithExactly(payload.req)
      })

      it('should stop recording metrics for the call', function () {
        expect(clientMetrics.stop).to.be.calledOnceWithExactly(
          clientInstrumentation,
          mockResponse
        )
      })
    })

    context('when response should not be cached', function () {
      beforeEach(async function () {
        response = await requestMiddleware({ useRedisCache: true }).req(payload)
      })

      it('should not set cache', function () {
        expect(cache.set).not.to.be.called
      })
    })

    context('when response should be cached', function () {
      beforeEach(async function () {
        payload.cacheKey = 'cache-key'
      })

      context('and redis is not enabled', function () {
        beforeEach(async function () {
          response = await requestMiddleware({ useRedisCache: false }).req(
            payload
          )
        })

        it('should set cache using in-memory cache', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.data,
            60,
            false
          )
        })
      })

      context('and redis is enabled', function () {
        beforeEach(async function () {
          response = await requestMiddleware({ useRedisCache: true }).req(
            payload
          )
        })

        it('should set cache using redis', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.data,
            60,
            true
          )
        })
      })

      context('and cacheExpiry is set', function () {
        beforeEach(async function () {
          response = await requestMiddleware({
            cacheExpiry: 200,
            useRedisCache: false,
          }).req(payload)
        })

        it('should set cache using explicit cacheExpiry value', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.data,
            200,
            false
          )
        })
      })
    })

    context('when endpoint returns an error', function () {
      const error = new Error()
      let thrownError
      beforeEach(async function () {
        payload.jsonApi.axios.rejects(error)
        await requestMiddleware()
          .req(payload)
          .catch(e => {
            thrownError = e
          })
      })

      it('should stop recording metrics for the call', function () {
        expect(clientMetrics.stopWithError).to.be.calledOnceWithExactly(
          clientInstrumentation,
          error
        )
      })

      it('should rethrow error', function () {
        expect(thrownError).to.equal(error)
      })
    })
  })
})
