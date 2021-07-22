const HttpAgent = require('agentkeepalive')
const proxyquire = require('proxyquire').noPreserveCache()

const { HttpsAgent } = HttpAgent

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

const requestDebugStub = sinon.stub()
const cacheDebugStub = sinon.stub()
const debugStub = sinon.stub()
debugStub.withArgs('app:api-client:request').callsFake(() => requestDebugStub)
debugStub.withArgs('app:api-client:cache').callsFake(arg => cacheDebugStub)

const requestMiddleware = proxyquire('./got-request', {
  got: gotStub,
  debug: debugStub,
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

      requestDebugStub.resetHistory()
      cacheDebugStub.resetHistory()
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
          expect(gotStub).to.be.calledOnce
          expect(gotStub.args[0][0]).to.have.all.keys({
            ...payload.req,
            agent: {},
            retry: {},
            timeout: 5000,
          })
        })

        it('should set retry options', function () {
          expect(gotStub.args[0][0].retry).to.deep.equal({
            limit: 1,
            methods: ['GET'],
            statusCodes: [502, 504],
          })
        })

        it('should not set timeout', function () {
          expect(gotStub.args[0][0].timeout).to.be.undefined
        })

        it('should use custom agent', function () {
          expect(gotStub.args[0][0].agent.http).to.an.instanceof(HttpAgent)
          expect(gotStub.args[0][0].agent.https).to.an.instanceof(HttpsAgent)
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

        it('should make request using Got library', function () {
          expect(gotStub).to.be.calledOnce
          expect(gotStub.args[0][0]).to.have.all.keys({
            ...payload.req,
            agent: {},
            retry: 2,
            timeout: 5000,
          })
        })

        it('should use correct timeout', function () {
          expect(gotStub.args[0][0].timeout).to.equal(50000)
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
      beforeEach(function () {
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

      beforeEach(function () {
        error = new Error('Mock error')
      })

      context('without response or request', function () {
        beforeEach(async function () {
          gotStub.rejects(error)

          await requestMiddleware()
            .req(payload)
            .catch(e => {
              thrownError = e
            })
        })

        it('should add debugging', function () {
          expect(requestDebugStub).to.be.calledWithExactly(
            '[500] Mock error',
            '(GET /path/to/endpoint)',
            error
          )
        })

        it('should not record metrics', function () {
          expect(clientMetrics.recordError).not.to.be.called
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
          expect(thrownError.statusCode).to.equal(500)
        })
      })

      context('with only response', function () {
        beforeEach(function () {
          error.response = {
            timings: {
              start: 1619711962865,
              end: 1619711962968,
            },
            requestUrl: 'http://host.com/path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }
        })

        context('with timeout error code', function () {
          beforeEach(async function () {
            error.message = 'Timeout error'
            error.code = 'ETIMEDOUT'

            gotStub.rejects(error)

            await requestMiddleware()
              .req(payload)
              .catch(e => {
                thrownError = e
              })
          })

          it('should add debugging', function () {
            expect(requestDebugStub).to.be.calledWithExactly(
              '[408] Timeout error',
              '(GET /path/to/endpoint)',
              error
            )
          })

          it('should stop recording metrics for the call', function () {
            expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
              payload.req,
              error,
              (error.response.timings.end - error.response.timings.start) / 1000
            )
          })

          it('should rethrow error', function () {
            expect(thrownError).to.equal(error)
            expect(thrownError.statusCode).to.equal(408)
          })
        })

        context('with bad request', function () {
          beforeEach(async function () {
            error.response.statusCode = 400
            error.response.statusMessage = 'Bad request'

            gotStub.rejects(error)

            await requestMiddleware()
              .req(payload)
              .catch(e => {
                thrownError = e
              })
          })

          it('should add debugging', function () {
            expect(requestDebugStub).to.be.calledWithExactly(
              '[400] Bad request',
              '(GET /path/to/endpoint)',
              error
            )
          })

          it('should stop recording metrics for the call', function () {
            expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
              payload.req,
              error,
              (error.response.timings.end - error.response.timings.start) / 1000
            )
          })

          it('should rethrow error', function () {
            expect(thrownError).to.equal(error)
            expect(thrownError.statusCode).to.equal(400)
          })
        })
      })

      context('with only request', function () {
        beforeEach(function () {
          error.request = {
            timings: {
              start: 1619711962865,
              // Note, failed requests contain an `error` key instead of `end`
              error: 1619711962968,
            },
            requestUrl: 'http://host.com/path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }
        })

        context('with timeout error code', function () {
          beforeEach(async function () {
            error.message = 'Timeout error'
            error.code = 'ETIMEDOUT'

            gotStub.rejects(error)

            await requestMiddleware()
              .req(payload)
              .catch(e => {
                thrownError = e
              })
          })

          it('should add debugging', function () {
            expect(requestDebugStub).to.be.calledWithExactly(
              '[408] Timeout error',
              '(GET /path/to/endpoint)',
              error
            )
          })

          it('should stop recording metrics for the call', function () {
            expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
              payload.req,
              error,
              (error.request.timings.error - error.request.timings.start) / 1000
            )
          })

          it('should rethrow error', function () {
            expect(thrownError).to.equal(error)
            expect(thrownError.statusCode).to.equal(408)
          })
        })
      })

      context('with both response and request', function () {
        beforeEach(async function () {
          error.request = {
            statusCode: 408,
            statusMessage: 'Timeout',
            timings: {
              start: 1619711962865,
              // Note, failed requests contain an `error` key instead of `end`
              error: 1619711962968,
            },
            requestUrl:
              'http://host.com/request-path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }
          error.response = {
            statusCode: 400,
            statusMessage: 'Bad request',
            timings: {
              start: 2619711962865,
              end: 2619711962968,
            },
            requestUrl:
              'http://host.com/response-path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }

          gotStub.rejects(error)

          await requestMiddleware()
            .req(payload)
            .catch(e => {
              thrownError = e
            })
        })

        it('should add debugging', function () {
          expect(requestDebugStub).to.be.calledWithExactly(
            '[400] Bad request',
            '(GET /path/to/endpoint)',
            error
          )
        })

        it('should stop recording metrics for the call', function () {
          expect(clientMetrics.recordError).to.be.calledOnceWithExactly(
            payload.req,
            error,
            (error.response.timings.end - error.response.timings.start) / 1000
          )
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
          expect(thrownError.statusCode).to.equal(400)
        })
      })

      context('without request end timing', function () {
        beforeEach(async function () {
          error.response = {
            statusCode: 400,
            statusMessage: 'Bad request',
            timings: {
              start: 2619711962865,
            },
            requestUrl:
              'http://host.com/response-path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }

          gotStub.rejects(error)

          await requestMiddleware()
            .req(payload)
            .catch(e => {
              thrownError = e
            })
        })

        it('should not record metrics for the call', function () {
          expect(clientMetrics.recordError).not.to.be.called
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
          expect(thrownError.statusCode).to.equal(400)
        })
      })

      context('without response error timing', function () {
        beforeEach(async function () {
          error.request = {
            statusCode: 408,
            statusMessage: 'Timeout',
            timings: {
              start: 1619711962865,
            },
            requestUrl:
              'http://host.com/request-path%3Ffoo%26bar%2Cfizz%2Cbuzz',
          }

          gotStub.rejects(error)

          await requestMiddleware()
            .req(payload)
            .catch(e => {
              thrownError = e
            })
        })

        it('should not record metrics for the call', function () {
          expect(clientMetrics.recordError).not.to.be.called
        })

        it('should rethrow error', function () {
          expect(thrownError).to.equal(error)
          expect(thrownError.statusCode).to.equal(408)
        })
      })
    })
  })
})
