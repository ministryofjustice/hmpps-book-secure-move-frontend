const proxyquire = require('proxyquire').noCallThru()

const mockConfig = {
  API: {
    BASE_URL: 'http://api.com/v1',
    TIMEOUT: 1000,
    CACHE_EXPIRY: 5000,
    CLIENT_ID: 'client-id',
    SECRET: 'not-a-secret',
    VERSION: 99,
    USE_REDIS_CACHE: true,
  },
  FILE_UPLOADS: {
    MAX_FILE_SIZE: 2000,
  },
  FEATURE_FLAGS: {
    GOT: true,
  },
}
const mockModels = {
  withoutOptions: {
    fields: {
      reference: '',
    },
  },
  withOptions: {
    fields: {
      name: '',
    },
    options: {
      collectionPath: 'complex/path',
    },
  },
}

function JsonApiStub(opts = {}) {
  this.init(opts)
}

describe('Back-end API client', function () {
  context('Singleton', function () {
    let jsonApi
    let middlewareMock

    beforeEach(function () {
      JsonApiStub.prototype.init = sinon.stub()
      JsonApiStub.prototype.replaceMiddleware = sinon.stub()
      JsonApiStub.prototype.insertMiddlewareBefore = sinon.stub()
      JsonApiStub.prototype.insertMiddlewareAfter = sinon.stub()
      JsonApiStub.prototype.define = sinon.stub()
      middlewareMock = {
        auth: sinon.stub(),
        post: sinon.stub(),
        cacheKey: sinon.stub().returnsArg(0),
        errors: sinon.stub(),
        getCache: sinon.stub().returnsArg(0),
        gotErrors: sinon.stub(),
        gotRequest: sinon.stub(),
        gotRequestTransformer: sinon.stub(),
        gotResponse: sinon.stub(),
        request: sinon.stub(),
        requestInclude: sinon.stub(),
        requestHeaders: sinon
          .stub()
          .returns({ 'X-Test-Header': 'headervalue' }),
        requestTimeout: sinon.stub().returnsArg(0),
      }

      jsonApi = proxyquire('./', {
        'devour-client': JsonApiStub,
        '../../../config': mockConfig,
        './models': mockModels,
        './middleware': middlewareMock,
      })
    })

    context('on first call', function () {
      let client
      let req

      context('with auth client ID and secret', function () {
        beforeEach(function () {
          req = {
            user: {
              userame: 'T_USER',
            },
          }
          client = jsonApi(req)
        })

        it('should create a new client', function () {
          expect(JsonApiStub.prototype.init).to.be.calledOnceWithExactly({
            apiUrl: mockConfig.API.BASE_URL,
            logger: false,
          })
        })

        it('should return an client API', function () {
          expect(client).to.be.a('object')
          expect(client).to.deep.equal(new JsonApiStub())
        })

        describe('middleware', function () {
          it('should replace error middleware', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.firstCall
            ).to.be.calledWithExactly('errors', middlewareMock.gotErrors)
          })

          it('should replace response middleware', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.secondCall
            ).to.be.calledWithExactly('response', middlewareMock.gotResponse)
          })

          it('should replace post middleware', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.thirdCall
            ).to.be.calledWithExactly(
              'POST',
              middlewareMock.post(mockConfig.FILE_UPLOADS.MAX_FILE_SIZE)
            )
          })

          it('should replace request middleware', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.getCall(3)
            ).to.be.calledWithExactly(
              'axios-request',
              middlewareMock.gotRequest(mockConfig.API.CACHE_EXPIRY)
            )
          })

          it('should insert cache key middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(0)
            ).to.be.calledWithExactly('got-request', {
              apiVersion: mockConfig.API.VERSION,
            })
          })

          it('should insert get cache middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(1)
            ).to.be.calledWithExactly('got-request', {
              useRedisCache: mockConfig.API.USE_REDIS_CACHE,
            })
          })

          it('should insert auth middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(2)
            ).to.be.calledWithExactly('got-request', middlewareMock.auth)
          })

          it('should insert request headers middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(3)
            ).to.be.calledWithExactly('got-request', {
              'X-Test-Header': 'headervalue',
            })
          })

          it('should insert request include middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(4)
            ).to.be.calledWithExactly(
              'got-request',
              middlewareMock.requestInclude
            )
          })

          it('should insert request include middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(5)
            ).to.be.calledWithExactly(
              'got-request',
              middlewareMock.gotRequestTransformer
            )
          })

          it('should call insertMiddlewareBefore correct number of times', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.callCount
            ).to.equal(6)
          })

          it('should call replaceMiddleware correct number of times', function () {
            expect(JsonApiStub.prototype.replaceMiddleware.callCount).to.equal(
              4
            )
          })
        })

        describe('models', function () {
          it('should define correct number of models', function () {
            expect(JsonApiStub.prototype.define.callCount).to.equal(2)
          })

          context('when model contains no options', function () {
            it('should not send options', function () {
              expect(
                JsonApiStub.prototype.define.firstCall
              ).to.be.calledWithExactly(
                'withoutOptions',
                mockModels.withoutOptions.fields,
                undefined
              )
            })
          })

          context('when model contains options', function () {
            it('should send options', function () {
              expect(
                JsonApiStub.prototype.define.secondCall
              ).to.be.calledWithExactly(
                'withOptions',
                mockModels.withOptions.fields,
                mockModels.withOptions.options
              )
            })
          })
        })
      })

      context('without auth client ID', function () {
        beforeEach(function () {
          jsonApi = proxyquire('./', {
            'devour-client': JsonApiStub,
            '../../../config': {
              ...mockConfig,
              API: {
                BASE_URL: 'http://api.com/v1',
                TIMEOUT: 1000,
                CACHE_EXPIRY: 5000,
                SECRET: 'not-a-secret',
              },
            },
            './models': mockModels,
            './middleware': middlewareMock,
          })

          client = jsonApi()
        })

        it('should not insert auth middleware', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore
          ).not.to.be.calledWithExactly('axios-request', middlewareMock.auth)
        })

        it('should call insertMiddlewareBefore correct number of times', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.callCount
          ).to.equal(5)
        })
      })

      context('without auth secret', function () {
        beforeEach(function () {
          jsonApi = proxyquire('./', {
            'devour-client': JsonApiStub,
            '../../../config': {
              ...mockConfig,
              API: {
                BASE_URL: 'http://api.com/v1',
                TIMEOUT: 1000,
                CACHE_EXPIRY: 5000,
                CLIENT_ID: 'a-client-id',
                SECRET: '',
              },
            },
            './models': mockModels,
            './middleware': middlewareMock,
          })

          client = jsonApi()
        })

        it('should not insert auth middleware', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore
          ).not.to.be.calledWithExactly('axios-request', middlewareMock.auth)
        })

        it('should call insertMiddlewareBefore correct number of times', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.callCount
          ).to.equal(5)
        })
      })

      context('with Got feature disabled', function () {
        beforeEach(function () {
          jsonApi = proxyquire('./', {
            'devour-client': JsonApiStub,
            '../../../config': {
              ...mockConfig,
              FEATURE_FLAGS: {
                GOT: false,
              },
            },
            './models': mockModels,
            './middleware': middlewareMock,
          })

          client = jsonApi()
        })

        it('should replace error middleware', function () {
          expect(
            JsonApiStub.prototype.replaceMiddleware.firstCall
          ).to.be.calledWithExactly('errors', middlewareMock.errors)
        })

        it('should not replace response middleware', function () {
          expect(JsonApiStub.prototype.replaceMiddleware).not.to.be.calledWith(
            'response'
          )
        })

        it('should replace request middleware with axios request', function () {
          expect(
            JsonApiStub.prototype.replaceMiddleware.getCall(2)
          ).to.be.calledWithExactly(
            'axios-request',
            middlewareMock.request(mockConfig.API.CACHE_EXPIRY)
          )
        })

        it('should not insert request transform middleware', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore
          ).not.to.be.calledWithExactly(
            'got-request',
            middlewareMock.gotRequestTransformer
          )
        })

        it('should insert request timeout', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.getCall(5)
          ).to.be.calledWithExactly('app-request', mockConfig.API.TIMEOUT)
        })
      })
    })
  })
})
