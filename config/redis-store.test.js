const bluebird = require('bluebird')
const proxyquire = require('proxyquire')

function MockRedisStore(opts = {}) {
  this.isStore = true
  this.init(opts)
}

MockRedisStore.prototype.init = opts => this

const mockRedisClient = {
  createClient: sinon.stub().returns('mockClient'),
}
const mockRedisConfig = {
  url: 'redis://defaultuser:defaultpassword@host.com/0',
}
const mockStoreOptions = {
  client: 'mockClient',
}
const errorStub = sinon.stub()
const retryStrategyStub = sinon.stub()

describe('Redis store', function () {
  describe('#redisStore()', function () {
    let redisStore

    beforeEach(function () {
      sinon.spy(MockRedisStore.prototype, 'init')
      sinon.stub(bluebird, 'promisifyAll')
    })

    context('without options', function () {
      let store

      before(function () {
        redisStore = proxyquire('./redis-store', {
          redis: mockRedisClient,
          'connect-redis': () => MockRedisStore,
          'node-redis-retry-strategy': () => retryStrategyStub,
          './': {
            REDIS: {
              SESSION: mockRedisConfig,
            },
          },
          './logger': {
            error: errorStub,
          },
        })
      })

      context('on first call', function () {
        beforeEach(function () {
          store = redisStore()
        })

        it('should create a new store with default options', function () {
          expect(mockRedisClient.createClient).to.be.calledWithExactly({
            ...mockRedisConfig,
            logErrors: errorStub,
            retry_strategy: retryStrategyStub,
          })
          expect(bluebird.promisifyAll).to.be.calledOnceWithExactly(
            'mockClient'
          )
          expect(MockRedisStore.prototype.init).to.be.calledOnceWithExactly(
            mockStoreOptions
          )
        })

        it('should return a new store', function () {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })

      context('on second call', function () {
        beforeEach(function () {
          store = redisStore()
        })

        it('should not create new client', function () {
          expect(MockRedisStore.prototype.init).not.to.be.called
        })

        it('should return a client', function () {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })

      context('on further calls', function () {
        beforeEach(function () {
          store = redisStore()
        })

        it('should not create new client', function () {
          expect(MockRedisStore.prototype.init).not.to.be.called
        })

        it('should return a client', function () {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })
    })

    context('with options', function () {
      const mockOptions = {
        url: 'redis://user:password@host.com/0',
      }
      let store

      before(function () {
        redisStore = proxyquire('./redis-store', {
          redis: mockRedisClient,
          'connect-redis': () => MockRedisStore,
          'node-redis-retry-strategy': () => retryStrategyStub,
          './': {
            REDIS: {
              SESSION: mockRedisConfig,
            },
          },
          './logger': {
            error: errorStub,
          },
        })
      })

      context('on first call', function () {
        beforeEach(function () {
          store = redisStore(mockOptions)
        })

        it('should create a new store with default options', function () {
          expect(mockRedisClient.createClient).to.be.calledWithExactly(
            mockOptions
          )
          expect(bluebird.promisifyAll).to.be.calledOnceWithExactly(
            'mockClient'
          )
          expect(MockRedisStore.prototype.init).to.be.calledOnceWithExactly(
            mockStoreOptions
          )
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })

      context('on second call', function () {
        beforeEach(function () {
          store = redisStore(mockOptions)
        })

        it('should not create new client', function () {
          expect(MockRedisStore.prototype.init).not.to.be.called
        })

        it('should return a client', function () {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })

      context('on further calls', function () {
        beforeEach(function () {
          store = redisStore(mockOptions)
        })

        it('should not create new client', function () {
          expect(MockRedisStore.prototype.init).not.to.be.called
        })

        it('should return a client', function () {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })
    })
  })
})
