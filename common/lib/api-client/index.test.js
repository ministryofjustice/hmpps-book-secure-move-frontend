const proxyquire = require('proxyquire').noCallThru()

const auth = require('./middleware/auth')

const mockConfig = {
  IS_DEV: false,
  API: {
    BASE_URL: 'http://api.com/v1',
    TIMEOUT: 1000,
  },
}
const mockModels = {
  withoutOptions: {
    attributes: {
      reference: '',
    },
  },
  withOptions: {
    attributes: {
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

describe('Back-end API client', function() {
  context('Singleton', function() {
    let jsonApi
    let errorsStub
    let requestTimeoutStub

    beforeEach(function() {
      errorsStub = sinon.stub()
      requestTimeoutStub = sinon.stub()
      JsonApiStub.prototype.init = sinon.stub()
      JsonApiStub.prototype.replaceMiddleware = sinon.stub()
      JsonApiStub.prototype.insertMiddlewareBefore = sinon.stub()
      JsonApiStub.prototype.define = sinon.stub()

      jsonApi = proxyquire('./', {
        'devour-client': JsonApiStub,
        '../../../config': mockConfig,
        './models': mockModels,
        './middleware': {
          errors: errorsStub,
          requestTimeout: requestTimeoutStub,
        },
      })
    })

    context('on first call', function() {
      let client

      beforeEach(function() {
        client = jsonApi()
      })

      it('should create a new client', function() {
        expect(JsonApiStub.prototype.init).to.be.calledOnceWithExactly({
          apiUrl: mockConfig.API.BASE_URL,
          logger: mockConfig.IS_DEV,
        })
      })

      it('should return an client API', function() {
        expect(client).to.be.a('object')
        expect(client).to.deep.equal(new JsonApiStub())
      })

      describe('middleware', function() {
        it('should replace error middleware', function() {
          expect(
            JsonApiStub.prototype.replaceMiddleware
          ).to.be.calledOnceWithExactly('errors', errorsStub)
        })

        it('should insert request timeout', function() {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.firstCall
          ).to.be.calledWith('axios-request')
          expect(requestTimeoutStub).to.be.calledOnceWithExactly(
            mockConfig.API.TIMEOUT
          )
        })

        it('should insert auth middleware', function() {
          expect(
            JsonApiStub.prototype.insertMiddlewareBefore.secondCall
          ).to.be.calledWithExactly('axios-request', auth.devourAuthMiddleware)
        })
      })

      describe('models', function() {
        it('should define correct number of models', function() {
          expect(JsonApiStub.prototype.define.callCount).to.equal(2)
        })

        context('when model contains no options', function() {
          it('should not send options', function() {
            expect(
              JsonApiStub.prototype.define.firstCall
            ).to.be.calledWithExactly(
              'withoutOptions',
              mockModels.withoutOptions.attributes,
              undefined
            )
          })
        })

        context('when model contains options', function() {
          it('should send options', function() {
            expect(
              JsonApiStub.prototype.define.secondCall
            ).to.be.calledWithExactly(
              'withOptions',
              mockModels.withOptions.attributes,
              mockModels.withOptions.options
            )
          })
        })
      })
    })

    context('on subsequent calls', function() {
      let firstInstance
      let secondInstance
      let thirdInstance

      beforeEach(function() {
        firstInstance = jsonApi()
        secondInstance = jsonApi()
        thirdInstance = jsonApi()
      })

      it('should only create one new client', function() {
        expect(JsonApiStub.prototype.init).to.be.calledOnce
      })

      describe('first instance', function() {
        it('should return an client API', function() {
          expect(firstInstance).to.be.a('object')
          expect(firstInstance).to.deep.equal(new JsonApiStub())
        })
      })

      describe('third instance', function() {
        it('should return an client API', function() {
          expect(thirdInstance).to.be.a('object')
          expect(thirdInstance).to.deep.equal(new JsonApiStub())
        })
      })

      describe('second instance', function() {
        it('should return an client API', function() {
          expect(secondInstance).to.be.a('object')
          expect(secondInstance).to.deep.equal(new JsonApiStub())
        })
      })
    })
  })
})
