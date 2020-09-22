const proxyquire = require('proxyquire').noPreserveCache()

const LRU = function () {}

const lruCache = LRU.prototype
lruCache.get = sinon.stub()
lruCache.set = sinon.stub()

const redisClient = {
  getAsync: sinon.stub().resolves(),
  setexAsync: sinon.stub().resolves(),
}

const cache = proxyquire('./cache', {
  '../../../config/redis-store': () => ({
    client: redisClient,
  }),
  'lru-cache': LRU,
})

describe('API Client', function () {
  describe('Cache module', function () {
    let cached
    beforeEach(function () {
      redisClient.getAsync.resetHistory().resolves()
      redisClient.setexAsync.resetHistory().resolves()
    })

    describe('#get', function () {
      describe('In-memory', function () {
        context('when fetching the cached value', function () {
          beforeEach(async function () {
            cached = await cache.get('cache-key', false)
          })

          it('should call the in-memory cache', function () {
            expect(lruCache.get).to.be.calledOnceWithExactly('cache-key')
          })
        })

        context('when no value has been cached', function () {
          beforeEach(async function () {
            cached = await cache.get('cache-key', false)
          })

          it('should return undefined', function () {
            expect(cached).to.be.undefined
          })
        })

        context('when a value has been cached', function () {
          beforeEach(async function () {
            lruCache.get.returns({ foo: 'bar' })
            cached = await cache.get('cache-key', false)
          })

          it('should return the cached value', function () {
            expect(cached).to.deep.equal({ foo: 'bar' })
          })
        })

        context('when a value has been cached as a string', function () {
          beforeEach(async function () {
            lruCache.get.returns('{"foo": "bar"}')
            cached = await cache.get('cache-key', false)
          })

          it('should return the parsed cached value', function () {
            expect(cached).to.deep.equal({ foo: 'bar' })
          })
        })
      })

      describe('Redis', function () {
        context('when fetching the cached value', function () {
          beforeEach(async function () {
            cached = await cache.get('cache-key', true)
          })

          it('should call the redis cache', function () {
            expect(redisClient.getAsync).to.be.calledOnceWithExactly(
              'cache-key'
            )
          })
        })

        context('when no value has been cached', function () {
          beforeEach(async function () {
            cached = await cache.get('cache-key', true)
          })

          it('should return undefined', function () {
            expect(cached).to.be.undefined
          })
        })

        context('when a value has been cached', function () {
          beforeEach(async function () {
            redisClient.getAsync.resolves({ foo: 'bar' })
            cached = await cache.get('cache-key', true)
          })

          it('should return the cached value', function () {
            expect(cached).to.deep.equal({ foo: 'bar' })
          })
        })

        context('when a value has been cached as a string', function () {
          beforeEach(async function () {
            redisClient.getAsync.resolves('{"foo": "bar"}')
            cached = await cache.get('cache-key', true)
          })

          it('should return the parsed cached value', function () {
            expect(cached).to.deep.equal({ foo: 'bar' })
          })
        })
      })
    })

    describe('#set', function () {
      const data = {
        foo: 'bar',
      }

      describe('In-memory', function () {
        context('when setting the cached value', function () {
          beforeEach(async function () {
            cached = await cache.set('cache-key', data, 100, false)
          })

          it('should call the in-memory cache', function () {
            expect(lruCache.set).to.be.calledOnceWithExactly(
              'cache-key',
              data,
              100
            )
          })
        })
      })

      describe('Redis', function () {
        context('when setting the cached value', function () {
          beforeEach(async function () {
            cached = await cache.set('cache-key', data, 100, true)
          })

          it('should call the redis cache', function () {
            expect(redisClient.setexAsync).to.be.calledOnceWithExactly(
              'cache-key',
              100,
              JSON.stringify(data)
            )
          })
        })
      })
    })
  })
})
