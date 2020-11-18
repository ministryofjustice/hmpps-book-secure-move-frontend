const proxyquire = require('proxyquire').noPreserveCache()

const cache = {
  set: sinon.stub(),
}

const clientMetrics = {
  record: sinon.stub(),
  recordSuccess: sinon.stub(),
  recordError: sinon.stub(),
}

const getDuration = sinon.stub().callsFake(() => {
  return 23
})
const timer = () => getDuration

const requestMiddleware = proxyquire('./request', {
  '../cache': cache,
  '../client-metrics': clientMetrics,
  '../../timer': timer,
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
      clientMetrics.recordSuccess.resetHistory()
      clientMetrics.recordError.resetHistory()
    })

    context('when payload includes a response', function () {
      it('should return payload response immediately', async function () {
        const payload = { req: {}, res: {} }
        const response = await requestMiddleware().req(payload)
        expect(response).to.deep.equal(payload.res)
      })
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

      it('should recording metrics for the call', function () {
        expect(clientMetrics.recordSuccess).to.be.calledOnceWithExactly(
          payload.req,
          mockResponse,
          23
        )
      })
    })

    context('when response’s resources should be populated', function () {
      beforeEach(async function () {
        payload.req.params.preserveResourceRefs = 'foo'
        response = await requestMiddleware().req(payload)
      })

      it('should remove populateResources property from params', function () {
        expect(response.req.params.preserveResourceRefs).to.be.undefined
      })
      it('should copy populateResources property to req object', function () {
        expect(response.req.preserveResourceRefs).to.equal('foo')
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
        expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
          payload.req,
          error,
          23
        )
      })

      it('should rethrow error', function () {
        expect(thrownError).to.equal(error)
      })
    })
  })
})
