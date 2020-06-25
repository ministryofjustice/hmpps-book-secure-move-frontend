const middleware = require('./request-include')

describe('API Client', function () {
  describe('Request include middleware', function () {
    describe('#req-include', function () {
      context('when payload does not include a request', function () {
        it('should return default payload', function () {
          expect(middleware.req()).to.deep.equal({})
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

          context('with default include on model', function () {
            it('should retain existing include', function () {
              request.params.include = 'authors,comments'
              jsonApi.models.mockModel.options = {
                defaultInclude: 'authors',
              }
              request.model = 'mockModel'
              middleware.req({ req: request, jsonApi })

              expect(request.params.include).to.equal('authors,comments')
            })
          })
        })

        context('without existing include request param', function () {
          context('with default include on model', function () {
            beforeEach(function () {
              request.model = 'mockModel'
            })

            context('with default include as a string', function () {
              it('should retain existing include', function () {
                jsonApi.models.mockModel.options = {
                  defaultInclude: 'authors,comments',
                }
                middleware.req({ req: request, jsonApi })
                expect(request.params.include).to.equal('authors,comments')
              })
            })

            context('with default include as an array', function () {
              it('should convert include to string', function () {
                jsonApi.models.mockModel.options = {
                  defaultInclude: ['authors', 'comments'],
                }
                middleware.req({ req: request, jsonApi })
                expect(request.params.include).to.equal('authors,comments')
              })
            })
          })

          context('without default include on model', function () {
            it('should not set include', function () {
              middleware.req({ req: request, jsonApi })

              expect(request.params.include).to.not.exist
            })
          })
        })
      })
    })
  })
})
