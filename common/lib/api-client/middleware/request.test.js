const proxyquire = require('proxyquire')

const mockModels = {
  cachedModel: {
    options: {
      cache: true,
    },
  },
  nonCachedModel: {
    options: {
      cache: false,
    },
  },
}
const mockResponse = {
  data: {
    foo: 'bar',
  },
}

describe('API Client', function() {
  describe('Request middleware', function() {
    let getAsyncStub
    let setexAsyncStub
    let payload
    let response
    let requestMiddleware

    beforeEach(function() {
      getAsyncStub = sinon.stub()
      setexAsyncStub = sinon.stub()
      payload = {
        jsonApi: {
          axios: sinon.stub().resolves(mockResponse),
        },
        req: {
          url: 'http://localhost:3030/path/to/endpoint',
          method: 'GET',
          params: {},
        },
      }
      requestMiddleware = proxyquire('./request', {
        '../../../../config/redis-store': () => {
          return {
            client: {
              getAsync: getAsyncStub,
              setexAsync: setexAsyncStub,
            },
          }
        },
        '../models': mockModels,
      })
    })

    context('when model should not be cached', function() {
      beforeEach(async function() {
        payload.req.model = 'nonCachedModel'
        response = await requestMiddleware().req(payload)
      })

      it('should make request using axios library with payload', function() {
        expect(payload.jsonApi.axios).to.be.calledOnceWithExactly(payload.req)
      })

      it('should not call redis client', function() {
        expect(getAsyncStub).not.to.be.called
        expect(setexAsyncStub).not.to.be.called
      })

      it('should return a request', function() {
        expect(response).to.deep.equal(mockResponse)
      })
    })

    context('when model should be cached', function() {
      beforeEach(function() {
        payload.req.model = 'cachedModel'
      })

      context('when result exists in Redis', function() {
        const mockRedisResponse = JSON.stringify(mockResponse.data)

        beforeEach(async function() {
          getAsyncStub.resolves(mockRedisResponse)
          response = await requestMiddleware().req(payload)
        })

        it('should attempt to get key from redis', function() {
          expect(getAsyncStub).to.be.calledOnceWithExactly(
            'cache:GET./path/to/endpoint'
          )
        })

        it('should not make request using axios library', function() {
          expect(payload.jsonApi.axios).not.to.be.called
        })

        it('should return a request', function() {
          expect(response).to.deep.equal(mockResponse)
        })
      })

      context('when result does not exist in Redis', function() {
        beforeEach(async function() {
          getAsyncStub.resolves(null)
          setexAsyncStub.resolves(true)
          response = await requestMiddleware().req(payload)
        })

        it('should attempt to get key from redis', function() {
          expect(getAsyncStub).to.be.calledOnceWithExactly(
            'cache:GET./path/to/endpoint'
          )
        })

        it('should make request using axios library', function() {
          expect(payload.jsonApi.axios).to.be.calledOnceWithExactly(payload.req)
        })

        it('should set response data in redis', function() {
          expect(setexAsyncStub).to.be.calledOnceWithExactly(
            'cache:GET./path/to/endpoint',
            60,
            JSON.stringify(mockResponse.data)
          )
        })

        it('should return a request', function() {
          expect(response).to.deep.equal(mockResponse)
        })
      })

      context('when request contains params', function() {
        beforeEach(async function() {
          getAsyncStub.resolves(null)
          payload.req.params = {
            name: 'John',
            page: 5,
            per_page: 100,
          }
          response = await requestMiddleware().req(payload)
        })

        it('should append search to key', function() {
          expect(getAsyncStub).to.be.calledOnceWithExactly(
            'cache:GET./path/to/endpoint?name=John&page=5&per_page=100'
          )
        })

        it('should return a request', function() {
          expect(response).to.deep.equal(mockResponse)
        })
      })

      describe('options', function() {
        beforeEach(async function() {
          getAsyncStub.resolves(null)
          setexAsyncStub.resolves(true)
        })

        context('without expiry argument', function() {
          beforeEach(async function() {
            response = await requestMiddleware().req(payload)
          })

          it('should use default value', function() {
            expect(setexAsyncStub.args[0][1]).to.equal(60)
          })
        })

        context('with expiry argument', function() {
          beforeEach(async function() {
            response = await requestMiddleware(1000).req(payload)
          })

          it('should use argument value', function() {
            expect(setexAsyncStub.args[0][1]).to.equal(1000)
          })
        })
      })
    })
  })
})
