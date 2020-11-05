const proxyquire = require('proxyquire').noPreserveCache()

const API_VERSION = 99

const redisClient = {}

const clearCacheReferenceData = proxyquire('./clear-cache-reference-data', {
  '../../config/redis-store.js': () => {
    return {
      client: redisClient,
    }
  },
  '../../config': {
    API: {
      VERSION: API_VERSION,
    },
  },
})

describe('Clear cache reference data', function () {
  beforeEach(function () {
    redisClient.scanAsyncData = []
    redisClient.scanAsync = sinon.stub().returns({
      then: f => f(redisClient.scanAsyncData.shift() || ['0', []]),
    })
    redisClient.del = sinon.stub().resolves()
  })

  context('when called without an arg', function () {
    beforeEach(function () {
      redisClient.scanAsyncData = [
        ['1', [`cache:v${API_VERSION}:GET./api/reference/locations/2`]],
        [
          '0',
          [
            `cache:v${API_VERSION}:GET./api/reference/locations/1`,
            `cache:v${API_VERSION}:GET./api/reference/genders/1`,
          ],
        ],
      ]
    })

    it('returns the deleted count and calls the redis functions with the correct args', async function () {
      expect(await clearCacheReferenceData()).to.eq(3)
      expect(redisClient.scanAsync).to.have.been.be.calledWithExactly(
        '0',
        'MATCH',
        `cache:v${API_VERSION}:GET./api/reference/*`,
        'COUNT',
        '100'
      )
      expect(redisClient.scanAsync).to.have.been.be.calledWithExactly(
        '1',
        'MATCH',
        `cache:v${API_VERSION}:GET./api/reference/*`,
        'COUNT',
        '100'
      )
      expect(redisClient.scanAsync.callCount).to.eq(2)
      expect(redisClient.del).to.have.been.calledWithExactly(
        `cache:v${API_VERSION}:GET./api/reference/locations/1`
      )
      expect(redisClient.del).to.have.been.calledWithExactly(
        `cache:v${API_VERSION}:GET./api/reference/genders/1`
      )
      expect(redisClient.del).to.have.been.calledWithExactly(
        `cache:v${API_VERSION}:GET./api/reference/locations/2`
      )
      expect(redisClient.del.callCount).to.eq(3)
    })
  })

  context('when called with an arg', function () {
    context('when the arg does not match any keys', function () {
      it("returns 0 and doesn't call redis.del", async function () {
        expect(await clearCacheReferenceData('locations')).to.eq(0)
        expect(redisClient.scanAsync).to.have.been.be.calledWithExactly(
          '0',
          'MATCH',
          `cache:v${API_VERSION}:GET./api/reference/locations*`,
          'COUNT',
          '100'
        )
        expect(redisClient.scanAsync.callCount).to.eq(1)
        expect(redisClient.del.callCount).to.eq(0)
      })
    })

    context('when the arg matches keys', function () {
      beforeEach(function () {
        redisClient.scanAsyncData = [
          ['1', [`cache:v${API_VERSION}:GET./api/reference/locations/3`]],
          [
            '0',
            [
              `cache:v${API_VERSION}:GET./api/reference/locations/1`,
              `cache:v${API_VERSION}:GET./api/reference/locations/2`,
            ],
          ],
        ]
      })

      it('returns the deleted count and calls the redis functions with the correct args', async function () {
        expect(await clearCacheReferenceData('locations')).to.eq(3)
        expect(redisClient.scanAsync).to.have.been.be.calledWithExactly(
          '0',
          'MATCH',
          `cache:v${API_VERSION}:GET./api/reference/locations*`,
          'COUNT',
          '100'
        )
        expect(redisClient.scanAsync).to.have.been.be.calledWithExactly(
          '1',
          'MATCH',
          `cache:v${API_VERSION}:GET./api/reference/locations*`,
          'COUNT',
          '100'
        )
        expect(redisClient.scanAsync.callCount).to.eq(2)
        expect(redisClient.del).to.have.been.calledWithExactly(
          `cache:v${API_VERSION}:GET./api/reference/locations/1`
        )
        expect(redisClient.del).to.have.been.calledWithExactly(
          `cache:v${API_VERSION}:GET./api/reference/locations/2`
        )
        expect(redisClient.del).to.have.been.calledWithExactly(
          `cache:v${API_VERSION}:GET./api/reference/locations/3`
        )
        expect(redisClient.del.callCount).to.eq(3)
      })
    })
  })
})
