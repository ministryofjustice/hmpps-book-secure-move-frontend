const proxyquire = require('proxyquire')

const cache = {
  get: sinon.stub(),
}

const middleware = proxyquire('./get-cache', {
  '../cache': cache,
})

const mockResponse = {
  foo: 'bar',
}

describe('API Client', function () {
  describe('Get cache middleware', function () {
    describe('#cache-key', function () {
      let expectedPayload
      let payload
      beforeEach(function () {
        payload = {}
        expectedPayload = { ...payload }
        cache.get.resetHistory()
      })

      context('when payload has no cache key', function () {
        beforeEach(function () {
          middleware().req(payload)
        })

        it('should not get the cached value', function () {
          expect(cache.get).to.not.be.called
        })

        it('should leave payload untouched', function () {
          expect(payload).to.deep.equal(expectedPayload)
        })
      })

      context('when payload has cache key', function () {
        beforeEach(function () {
          payload = {
            cacheKey: 'cache-key',
          }
        })

        context('and a value has been cached', function () {
          beforeEach(async function () {
            cache.get.resolves(mockResponse)
            expectedPayload = { ...payload, res: { body: mockResponse } }
            middleware().req(payload)
          })

          it('should get the cached value', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', false)
          })

          it('should add the cached value as response to the payload', function () {
            expect(payload).to.deep.equal(expectedPayload)
          })
        })

        context('but no value has been cached', function () {
          beforeEach(function () {
            expectedPayload = { ...payload }
            middleware().req(payload)
          })

          it('should get the cached value', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', false)
          })

          it('should leave payload untouched', function () {
            expect(payload).to.deep.equal(expectedPayload)
          })
        })

        context('and redis is enabled', function () {
          beforeEach(function () {
            middleware({ useRedisCache: true }).req(payload)
          })

          it('should tell cache module to use redis', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', true)
          })
        })
      })
    })
  })
})
