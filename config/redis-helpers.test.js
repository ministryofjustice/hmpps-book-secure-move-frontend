const { buildRedisUrl } = require('./redis-helpers')

describe('Redis helpers', function () {
  describe('#buildRedisUrl()', function () {
    const env = Object.assign({}, process.env)

    after(function() {
      process.env = env;
    });

    context('in production', function () {
      before(function() {
        process.env.REDIS_URL = 'redis-r-us.com'
        process.env.REDIS_AUTH_TOKEN = 'secret'
        process.env.NODE_ENV = 'production'
      });

      it('should return a correctly formatted URL including a password', function () {
        expect(buildRedisUrl()).to.equal('redis://:secret@redis-r-us.com:6379/0')
      })
    })

    context('in development', function () {
      before(function() {
        process.env.REDIS_URL = 'redis://redis-r-us.com:6379'
        process.env.REDIS_AUTH_TOKEN = null
        process.env.NODE_ENV = 'development'
      });

      it('should just return the REDIS_URL env var', function () {
        expect(buildRedisUrl()).to.equal('redis://redis-r-us.com:6379')
      })
    })
  })
})
