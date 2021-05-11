const FormData = require('form-data')

const postMiddleware = require('./post')

const MAX_FILE_SIZE = 2000

const originalHeaders = {
  original: 'header',
  'content-type': 'application/vnd.api+json',
}

describe('API Client', function () {
  describe('POST middleware', function () {
    describe('#req()', function () {
      let jsonApi, payload, originalMiddleware, response

      beforeEach(function () {
        originalMiddleware = {
          name: 'POST',
          req: sinon.stub().returnsArg(0),
        }
        jsonApi = {
          _originalMiddleware: [originalMiddleware],
        }
        payload = {
          jsonApi,
          req: {
            headers: {
              ...originalHeaders,
            },
            data: {},
          },
        }
      })

      context('when request method is POST', function () {
        beforeEach(function () {
          payload.req.method = 'POST'
        })

        context('when data is instance of FormData', function () {
          beforeEach(function () {
            payload.req.data = new FormData()
            response = postMiddleware(MAX_FILE_SIZE).req(payload)
          })

          it('should update headers', function () {
            expect(response.req.headers).to.deep.equal({
              ...payload.req.headers,
              ...payload.req.data.getHeaders(),
            })
          })

          it('should set correct max lengths for content and body', function () {
            expect(response.req.maxContentLength).to.equal(MAX_FILE_SIZE)
            expect(response.req.maxBodyLength).to.equal(MAX_FILE_SIZE)
          })

          it('should return payload', function () {
            expect(response).to.deep.equal(payload)
          })

          it('should not call original middleware', function () {
            expect(originalMiddleware.req).not.to.be.called
          })
        })

        context('when data is not instance of FormData', function () {
          beforeEach(function () {
            response = postMiddleware().req(payload)
          })

          it('should not update headers', function () {
            expect(response.req.headers).to.deep.equal(originalHeaders)
          })

          it('should return payload', function () {
            expect(response).to.deep.equal(payload)
          })

          it('should call original middleware', function () {
            expect(originalMiddleware.req).to.calledOnceWithExactly(payload)
          })
        })
      })

      context('when request is not POST', function () {
        beforeEach(function () {
          response = postMiddleware().req(payload)
        })

        it('should not update headers', function () {
          expect(response.req.headers).to.deep.equal(originalHeaders)
        })

        it('should return original payload', function () {
          expect(response).to.deep.equal(payload)
        })

        it('should call original middleware', function () {
          expect(originalMiddleware.req).to.calledOnceWithExactly(payload)
        })
      })
    })
  })
})
