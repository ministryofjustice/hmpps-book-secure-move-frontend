const proxyquire = require('proxyquire').noCallThru()

function loadRedisDependency({ REDIS = {}, redisStore = () => {} } = {}) {
  const dependencies = proxyquire('./dependencies', {
    '../../config': {
      AUTH_PROVIDERS: {},
      DEFAULT_AUTH_PROVIDER: 'default',
      API: {},
      NOMIS_ELITE2_API: {},
      REDIS,
    },
    '../../config/redis-store': redisStore,
  })

  return dependencies.find(dependency => dependency.name === 'redis')
}

describe('Healthcheck dependencies', function () {
  describe('redis', function () {
    context('when REDIS.SESSION is not configured', function () {
      it('should resolve with `NOT RUNNING`', async function () {
        const redis = loadRedisDependency({ REDIS: {} })

        await expect(redis.healthcheck()).to.eventually.equal('NOT RUNNING')
      })
    })

    context('when REDIS.SESSION is configured', function () {
      context('when ping resolves', function () {
        it('should resolve with `OK`', async function () {
          const redis = loadRedisDependency({
            REDIS: { SESSION: {} },
            redisStore: async () => ({
              client: { ping: sinon.stub().resolves('PONG') },
            }),
          })

          await expect(redis.healthcheck()).to.eventually.equal('OK')
        })
      })

      context('when ping resolves with a falsy value', function () {
        it('should throw `No connection`', async function () {
          const redis = loadRedisDependency({
            REDIS: { SESSION: {} },
            redisStore: async () => ({
              client: { ping: sinon.stub().resolves(null) },
            }),
          })

          await expect(redis.healthcheck()).to.be.rejectedWith(
            'No connection'
          )
        })
      })

      context('when ping rejects', function () {
        it('should propagate the error', async function () {
          const redis = loadRedisDependency({
            REDIS: { SESSION: {} },
            redisStore: async () => ({
              client: {
                ping: sinon.stub().rejects(new Error('Connection refused')),
              },
            }),
          })

          await expect(redis.healthcheck()).to.be.rejectedWith(
            'Connection refused'
          )
        })
      })

      context('when ping never resolves', function () {
        let clock

        beforeEach(function () {
          clock = sinon.useFakeTimers()
        })

        afterEach(function () {
          clock.restore()
        })

        it('should throw `Timed out` after 5 seconds', async function () {
          const redis = loadRedisDependency({
            REDIS: { SESSION: {} },
            redisStore: async () => ({
              client: { ping: () => new Promise(() => {}) },
            }),
          })

          const result = expect(redis.healthcheck()).to.be.rejectedWith(
            'Timed out'
          )

          await clock.tickAsync(5000)
          await result
        })
      })
    })
  })
})
