const proxyquire = require('proxyquire').noCallThru()

const mockConfig = {
  IS_DEV: false,
  API: {
    BASE_URL: 'http://api.com/v1',
    TIMEOUT: 1000,
    CACHE_EXPIRY: 5000,
    CLIENT_ID: 'client-id',
    SECRET: 'not-a-secret',
  },
  FILE_UPLOADS: {
    MAX_FILE_SIZE: 2000,
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
    let authStub
    let requestHeadersStub
    let postStub
    let errorsStub
    let requestStub
    let requestIncludeStub
    let requestTimeoutStub
    let middlewareMock

    beforeEach(function () {
      authStub = sinon.stub()
      requestHeadersStub = sinon.stub()
      postStub = sinon.stub()
      errorsStub = sinon.stub()
      requestStub = sinon.stub()
      requestIncludeStub = sinon.stub()
      requestTimeoutStub = sinon.stub()
      JsonApiStub.prototype.init = sinon.stub()
      JsonApiStub.prototype.replaceMiddleware = sinon.stub()
      JsonApiStub.prototype.insertMiddlewareBefore = sinon.stub()
      JsonApiStub.prototype.define = sinon.stub()
      middlewareMock = {
        auth: authStub,
        post: postStub,
        errors: errorsStub,
        request: requestStub,
        requestInclude: requestIncludeStub,
        requestHeaders: requestHeadersStub,
        requestTimeout: requestTimeoutStub,
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

      context('with auth client ID and secret', function () {
        beforeEach(function () {
          client = jsonApi()
        })

        it('should create a new client', function () {
          expect(JsonApiStub.prototype.init).to.be.calledOnceWithExactly({
            apiUrl: mockConfig.API.BASE_URL,
            logger: mockConfig.IS_DEV,
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
            ).to.be.calledWithExactly('errors', errorsStub)
          })

          it('should replace post middleware', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.secondCall
            ).to.be.calledWithExactly(
              'POST',
              postStub(mockConfig.FILE_UPLOADS.MAX_FILE_SIZE)
            )
          })

          it('should insert request cache', function () {
            expect(
              JsonApiStub.prototype.replaceMiddleware.thirdCall
            ).to.be.calledWithExactly(
              'axios-request',
              requestStub(mockConfig.API.CACHE_EXPIRY)
            )
          })

          it('should insert request timeout', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(0)
            ).to.be.calledWithExactly(
              'axios-request',
              requestTimeoutStub(mockConfig.API.TIMEOUT)
            )
          })

          it('should insert request headers middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(1)
            ).to.be.calledWithExactly('axios-request', requestHeadersStub)
          })

          it('should insert request include middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(2)
            ).to.be.calledWithExactly('axios-request', requestIncludeStub)
          })

          it('should insert auth middleware', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.getCall(3)
            ).to.be.calledWithExactly('axios-request', authStub)
          })

          it('should call insertMiddlewareBefore correct number of times', function () {
            expect(
              JsonApiStub.prototype.insertMiddlewareBefore.callCount
            ).to.equal(4)
          })

          it('should call replaceMiddleware correct number of times', function () {
            expect(JsonApiStub.prototype.replaceMiddleware.callCount).to.equal(
              3
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
          ).not.to.be.calledWithExactly('axios-request', authStub)
        })

        it('should call insertMiddlewareBefore correct number of times', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.callCount
          ).to.equal(3)
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
          ).not.to.be.calledWithExactly('axios-request', authStub)
        })

        it('should call insertMiddlewareBefore correct number of times', function () {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.callCount
          ).to.equal(3)
        })
      })
    })

    context('on subsequent calls', function () {
      let firstInstance
      let secondInstance
      let thirdInstance

      beforeEach(function () {
        firstInstance = jsonApi()
        secondInstance = jsonApi()
        thirdInstance = jsonApi()
      })

      it('should only create one new client', function () {
        expect(JsonApiStub.prototype.init).to.be.calledOnce
      })

      describe('first instance', function () {
        it('should return an client API', function () {
          expect(firstInstance).to.be.a('object')
          expect(firstInstance).to.deep.equal(new JsonApiStub())
        })
      })

      describe('third instance', function () {
        it('should return an client API', function () {
          expect(thirdInstance).to.be.a('object')
          expect(thirdInstance).to.deep.equal(new JsonApiStub())
        })
      })

      describe('second instance', function () {
        it('should return an client API', function () {
          expect(secondInstance).to.be.a('object')
          expect(secondInstance).to.deep.equal(new JsonApiStub())
        })
      })
    })
  })
})
