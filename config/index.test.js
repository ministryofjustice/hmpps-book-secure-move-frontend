const { buildRedisUrl } = require('.')

describe('Redis helpers', function () {
  describe('#buildRedisUrl()', function () {
    context('on Cloud Platform', function () {
      it('should return a correctly formatted URL including a password', function () {
        expect(buildRedisUrl('redis-r-us.com', 'secret')).to.equal('redis://:secret@redis-r-us.com:6379/0')
      })
    })

    context('outside Cloud Platform', function () {
      it('should just return the REDIS_URL env var', function () {
        expect(buildRedisUrl('redis://redis-r-us.com:6379', null)).to.equal('redis://redis-r-us.com:6379')
      })
    })
  })
})
