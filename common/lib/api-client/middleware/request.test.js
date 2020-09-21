const proxyquire = require('proxyquire').noPreserveCache()

const cache = {
  set: sinon.stub(),
}

const requestMiddleware = proxyquire('./request', {
  '../cache': cache,
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

      context('when endpoint returns an error', function () {
        const error = new Error()
        beforeEach(async function () {
          payload.jsonApi.axios.rejects(error)
        })

        it('should rethrow error', function () {
          return requestMiddleware()
            .req(payload)
            .catch(e => expect(e).to.equal(error))
        })
      })
    })
  })
})
