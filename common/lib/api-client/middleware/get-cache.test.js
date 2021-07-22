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
      let payload

      beforeEach(function () {
        payload = {}
        cache.get.resetHistory()
      })

      context('when payload has no cache key', function () {
        beforeEach(async function () {
          await middleware().req(payload)
        })

        it('should not get the cached value', function () {
          expect(cache.get).to.not.be.called
        })

        it('should leave payload untouched', function () {
          expect(payload).to.deep.equal({})
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
            await middleware().req(payload)
          })

          it('should get the cached value', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', false)
          })

          it('should add the cached value as response to the payload', function () {
            expect(payload).to.deep.equal({
              cacheKey: 'cache-key',
              res: { body: mockResponse, data: mockResponse },
            })
          })
        })

        context('but no value has been cached', function () {
          beforeEach(async function () {
            await middleware().req({
              cacheKey: 'cache-key',
            })
          })

          it('should get the cached value', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', false)
          })

          it('should leave payload untouched', function () {
            expect(payload).to.deep.equal({
              cacheKey: 'cache-key',
            })
          })
        })

        context('and redis is enabled', function () {
          beforeEach(async function () {
            await middleware({ useRedisCache: true }).req(payload)
          })

          it('should tell cache module to use redis', function () {
            expect(cache.get).to.be.calledOnceWithExactly('cache-key', true)
          })
        })
      })
    })
  })
})
