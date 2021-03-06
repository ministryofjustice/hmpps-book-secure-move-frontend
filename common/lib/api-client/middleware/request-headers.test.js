const proxyquire = require('proxyquire')

const getRequestHeadersStub = sinon
  .stub()
  .returns({ mockHeader: 'header value' })

const middleware = proxyquire('./request-headers', {
  '../request-headers': getRequestHeadersStub,
})

describe('API Client', function () {
  describe('Request headers middleware', function () {
    describe('#request-headers', function () {
      context('when payload includes a response', function () {
        it('should return payload as is', function () {
          const payload = { req: {}, res: {} }
          expect(middleware().req(payload)).to.deep.equal({ ...payload })
        })
      })

      context('when payload contains a request', function () {
        let request

        beforeEach(function () {
          request = {
            headers: {
              Accept: 'Something',
            },
          }
          middleware(request).req({ req: request })
        })

        it('should get the request headers', function () {
          expect(getRequestHeadersStub).to.be.calledOnceWithExactly(request)
        })

        it('should add the default request headers', function () {
          expect(request.headers).to.deep.equal({
            Accept: 'Something',
            mockHeader: 'header value',
          })
        })
      })
    })
  })
})
