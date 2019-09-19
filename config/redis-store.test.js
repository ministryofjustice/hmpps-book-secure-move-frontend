const proxyquire = require('proxyquire')

function MockRedisStore(opts = {}) {
  this.isStore = true
  this.init(opts)
}
MockRedisStore.prototype.init = opts => {
  return this
}

const mockRedisClient = {
  createClient: sinon.stub().returns('mockClient'),
}

const redisStore = proxyquire('./redis-store', {
  redis: mockRedisClient,
  'connect-redis': function() {
    return MockRedisStore
  },
})

const mockOptions = {
  url: 'redis://user:password@host.com/0',
  client: 'mockClient',
}

describe('Redis store', function() {
  describe('#redisStore()', function() {
    let store

    beforeEach(function() {
      sinon.spy(MockRedisStore.prototype, 'init')
    })

    context('with first call', function() {
      context('without options', function() {
        beforeEach(function() {
          store = redisStore()
        })

        it('should not create a new client', function() {
          expect(MockRedisStore.prototype.init).not.to.be.called
        })

        it('should return nothing', function() {
          expect(store).to.equal()
        })
      })

      context('with options', function() {
        beforeEach(function() {
          store = redisStore(mockOptions)
        })

        it('should create a new client', function() {
          expect(MockRedisStore.prototype.init).to.be.calledOnceWithExactly(
            mockOptions
          )
        })

        it('should return a new client', function() {
          expect(store).to.be.a('object')
          expect(store).to.deep.equal(new MockRedisStore())
        })
      })
    })

    context('with subsequent calls', function() {
      beforeEach(function() {
        store = redisStore(mockOptions)
      })

      it('should not create new client', function() {
        expect(MockRedisStore.prototype.init).not.to.be.called
      })

      it('should return a client', function() {
        expect(store).to.be.a('object')
        expect(store).to.deep.equal(new MockRedisStore())
      })
    })
  })
})
