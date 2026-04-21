const proxyquire = require('proxyquire')

function MockRedisStore(opts = {}) {
  this.client = opts.client
}

const mockRedisConfig = {
  url: 'redis://defaultuser:defaultpassword@host.com/0',
}

const errorStub = sinon.stub()

describe('Redis store', function () {
  let mockClient
  let mockRedisClient
  let redisStore

  beforeEach(function () {
    mockClient = {
      connect: sinon.stub().resolves(),
      on: sinon.stub(),
    }

    mockRedisClient = {
      createClient: sinon.stub().returns(mockClient),
    }

    redisStore = proxyquire('./redis-store', {
      redis: mockRedisClient,
      'connect-redis': {
        RedisStore: MockRedisStore,
      },
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

  context('without options', function () {
    it('creates and caches a redis store', async function () {
      const store1 = await redisStore()
      const store2 = await redisStore()

      sinon.assert.calledOnce(mockRedisClient.createClient)
      sinon.assert.calledOnce(mockClient.connect)

      expect(store1).to.equal(store2)
      expect(store1.client).to.equal(mockClient)
    })
  })

  context('with options', function () {
    const mockOptions = {
      url: 'redis://user:password@host.com/0',
      socket: {
        reconnectStrategy: () => 1000,
      },
    }

    it('uses provided options on first call only', async function () {
      const store1 = await redisStore(mockOptions)
      const store2 = await redisStore({
        url: 'redis://ignored@host.com/0',
      })

      sinon.assert.calledOnceWithExactly(
        mockRedisClient.createClient,
        mockOptions
      )
      sinon.assert.calledOnce(mockClient.connect)

      expect(store1).to.equal(store2)
    })
  })
})
