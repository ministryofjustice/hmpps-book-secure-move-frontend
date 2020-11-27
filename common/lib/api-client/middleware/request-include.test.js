const middleware = require('./request-include')

describe('API Client', function () {
  describe('Request include middleware', function () {
    describe('#request-include', function () {
      context('when payload includes a response', function () {
        it('should return payload as is', function () {
          const payload = { req: {}, res: {} }
          expect(middleware.req(payload)).to.deep.equal({ ...payload })
        })
      })

      context('when payload contains a request', function () {
        let request, jsonApi

        beforeEach(function () {
          request = {
            params: {},
          }
          jsonApi = {
            models: {
              mockModel: {
                options: {},
              },
            },
          }
        })

        context('with existing include request param', function () {
          context('with include as a string', function () {
            it('should retain existing include', function () {
              request.params.include = 'authors,comments'
              middleware.req({ req: request })

              expect(request.params.include).to.equal('authors,comments')
            })
          })

          context('with include as an array', function () {
            it('should convert include to string', function () {
              request.params.include = ['authors', 'comments']
              middleware.req({ req: request })

              expect(request.params.include).to.equal('authors,comments')
            })
          })

          context('with include as an empty array', function () {
            it('should not set the include', function () {
              request.params.include = []
              middleware.req({ req: request })

              expect(request.params.include).to.not.exist
            })
          })

          context('with include as an empty string', function () {
            it('should not set the include', function () {
              request.params.include = ''
              middleware.req({ req: request })

              expect(request.params.include).to.not.exist
            })
          })
        })

        context('without existing include request param', function () {
          it('should not set include', function () {
            middleware.req({ req: request, jsonApi })

            expect(request.params.include).to.not.exist
          })
        })
      })
    })
  })
})
