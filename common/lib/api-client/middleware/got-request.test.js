const Sentry = require('@sentry/node')
const proxyquire = require('proxyquire').noPreserveCache()

const cache = {
  set: sinon.stub(),
}

const clientMetrics = {
  record: sinon.stub(),
  recordSuccess: sinon.stub(),
  recordError: sinon.stub(),
}

const getDuration = sinon.stub().callsFake(() => {
  return 23
})
const timer = () => getDuration

const mockResponse = {
  body: {
    data: {
      foo: 'bar',
    },
    meta: {
      fizz: 'buzz',
    },
  },
  timings: {
    start: 1619711962865,
    end: 1619711962968,
  },
}

const gotStub = sinon.stub().resolves(mockResponse)

const requestMiddleware = proxyquire('./got-request', {
  got: gotStub,
  '../cache': cache,
  '../client-metrics': clientMetrics,
  '../../timer': timer,
})

describe('API Client', function () {
  describe('Got request middleware', function () {
    let payload
    let response

    beforeEach(function () {
      payload = {
        req: {
          url: 'http://localhost:3030/path/to/endpoint',
          method: 'GET',
          params: {},
        },
      }

      sinon.stub(Sentry, 'addBreadcrumb')

      gotStub.resetHistory()
      cache.set.resetHistory()
      clientMetrics.recordSuccess.resetHistory()
      clientMetrics.recordError.resetHistory()
    })

    context('when payload includes a response', function () {
      it('should return payload response immediately', async function () {
        const payload = { req: {}, res: {} }
        const response = await requestMiddleware().req(payload)
        expect(response).to.deep.equal(payload.res)
      })
    })

    context('when calling api endpoint', function () {
      context('without specified timeout', function () {
        beforeEach(async function () {
          response = await requestMiddleware().req(payload)
        })

        it('should make request using Got library with payload', function () {
          expect(gotStub).to.be.calledOnceWithExactly({
            ...payload.req,
            timeout: undefined,
          })
        })

        it('should return response', function () {
          expect(response).to.deep.equal(mockResponse)
        })

        it('should recording metrics for the call', function () {
          expect(clientMetrics.recordSuccess).to.be.calledOnceWithExactly(
            payload.req,
            mockResponse,
            (mockResponse.timings.end - mockResponse.timings.start) / 1000
          )
        })
      })

      context('with specified timeout', function () {
        beforeEach(async function () {
          response = await requestMiddleware({ timeout: 50000 }).req(payload)
        })

        it('should make request using Got library using timeout', function () {
          expect(gotStub).to.be.calledOnceWithExactly({
            ...payload.req,
            timeout: 50000,
          })
        })
      })

      context('without response timing', function () {
        beforeEach(async function () {
          gotStub.resolves({
            ...mockResponse,
            timings: undefined,
          })
          response = await requestMiddleware().req(payload)
        })

        it('should not record metrics for the call', function () {
          expect(clientMetrics.recordSuccess).not.to.be.called
        })
      })
    })

    context('when response should not be cached', function () {
      beforeEach(async function () {
        response = await requestMiddleware({ useRedisCache: true }).req(payload)
      })

      it('should not set cache', function () {
        expect(cache.set).not.to.be.called
      })
    })

    context('when response should be cached', function () {
      beforeEach(async function () {
        payload.cacheKey = 'cache-key'
      })

      context('and redis is not enabled', function () {
        beforeEach(async function () {
          response = await requestMiddleware({ useRedisCache: false }).req(
            payload
          )
        })

        it('should set cache using in-memory cache', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.body,
            60,
            false
          )
        })
      })

      context('and redis is enabled', function () {
        beforeEach(async function () {
          response = await requestMiddleware({ useRedisCache: true }).req(
            payload
          )
        })

        it('should set cache using redis', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.body,
            60,
            true
          )
        })
      })

      context('and cacheExpiry is set', function () {
        beforeEach(async function () {
          response = await requestMiddleware({
            cacheExpiry: 200,
            useRedisCache: false,
          }).req(payload)
        })

        it('should set cache using explicit cacheExpiry value', function () {
          expect(cache.set).to.be.calledOnceWithExactly(
            payload.cacheKey,
            mockResponse.body,
            200,
            false
          )
        })
      })
    })

    context('when endpoint returns an error', function () {
      let thrownError
      let error

      context('without response', function () {
        beforeEach(async function () {
          error = new Error()

          gotStub.rejects(error)

          await requestMiddleware()
            .req(payload)
            .catch(e => {
              thrownError = e
            })
        })

        it('should not record metrics', function () {
          expect(clientMetrics.recordError).not.to.be.called
        })

        it('should add a Sentry breadcrumb', function () {
          expect(Sentry.addBreadcrumb).to.be.calledOnceWithExactly({
            type: 'http',
            category: 'http',
            data: {
              method: 'GET',
              url: undefined,
              status_code: 500,
            },
            level: Sentry.Severity.Info,
          })
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
        })
      })

      context('with response', function () {
        beforeEach(function () {
          error = new Error()
          error.response = {
            timings: {
              start: 1619711962865,
              end: 1619711962968,
            },
          }
        })

        context('with aborted connection', function () {
          beforeEach(async function () {
            error.code = 'ECONNABORTED'
            error.response.requestUrl =
              'http://host.com/path%3Ffoo%26bar%2Cfizz%2Cbuzz'

            gotStub.rejects(error)

            await requestMiddleware()
              .req(payload)
              .catch(e => {
                thrownError = e
              })
          })

          it('should stop recording metrics for the call', function () {
            expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
              payload.req,
              error,
              (error.response.timings.end - error.response.timings.start) / 1000
            )
          })

          it('should add a Sentry breadcrumb', function () {
            expect(Sentry.addBreadcrumb).to.be.calledOnceWithExactly({
              type: 'http',
              category: 'http',
              data: {
                method: 'GET',
                url: 'http://host.com/path?foo&bar,fizz,buzz',
                status_code: 408,
              },
              level: Sentry.Severity.Info,
            })
          })

          it('should rethrow error', function () {
            expect(thrownError).to.equal(error)
          })
        })

        context('with status code', function () {
          beforeEach(async function () {
            error.response.statusCode = 502
            error.response.statusMessage = 'Bad gateway'

            gotStub.rejects(error)

            await requestMiddleware()
              .req(payload)
              .catch(e => {
                thrownError = e
              })
          })

          it('should stop recording metrics for the call', function () {
            expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
              payload.req,
              error,
              (error.response.timings.end - error.response.timings.start) / 1000
            )
          })

          it('should add a Sentry breadcrumb', function () {
            expect(Sentry.addBreadcrumb).to.be.calledOnceWithExactly({
              type: 'http',
              category: 'http',
              data: {
                method: 'GET',
                url: undefined,
                status_code: 502,
              },
              level: Sentry.Severity.Info,
            })
          })

          it('should rethrow error', function () {
            expect(thrownError).to.equal(error)
          })
        })
      })
    })
  })
})
