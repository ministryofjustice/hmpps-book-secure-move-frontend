const proxyquire = require('proxyquire')

const findUnpopulatedResourcesStub = sinon.stub()

const middleware = proxyquire('./process-response', {
  '../../find-unpopulated-resources': findUnpopulatedResourcesStub,
})

describe('API Client', function () {
  describe('Response processing middleware', function () {
    describe('#process-response', function () {
      context('when payload includes a response', function () {
        it('should return payload as is', function () {
          const payload = { req: {}, res: {} }
          expect(middleware.req(payload)).to.deep.equal({ ...payload })
        })
      })

      context('when payload contains a response', function () {
        let response
        let processedResponse

        beforeEach(function () {
          findUnpopulatedResourcesStub.resetHistory()
          response = {
            data: {
              data: {},
              included: [{ id: 'foo', type: 'foos' }],
            },
            req: {},
          }
        })

        context('and the response should not be processed', function () {
          beforeEach(function () {
            processedResponse = middleware.req(
              JSON.parse(JSON.stringify(response))
            )
          })
          it('should return the response unchanged', function () {
            expect(processedResponse).to.deep.equal(response)
          })
        })

        context('and the response should be processed', function () {
          beforeEach(function () {
            findUnpopulatedResourcesStub.returns([
              {
                id: 'bar',
                type: 'bars',
              },
            ])
            response.req.preserveResourceRefs = true
          })

          context('when preserveResourceRefs is set to true', function () {
            beforeEach(function () {
              processedResponse = middleware.req(response)
            })
            it('should look for matched resources', function () {
              expect(findUnpopulatedResourcesStub).to.be.calledOnceWithExactly(
                response.data,
                {}
              )
            })
          })

          context('when preserveResourceRefs is an object', function () {
            beforeEach(function () {
              response.req.preserveResourceRefs = { foo: 'bar' }
              processedResponse = middleware.req(response)
            })
            it('should look for matched resources and pass the preserveResourceRefs object as options', function () {
              expect(
                findUnpopulatedResourcesStub
              ).to.be.calledOnceWithExactly(response.data, { foo: 'bar' })
            })
          })

          context(
            'when matched resources is not already in included',
            function () {
              beforeEach(function () {
                processedResponse = middleware.req(response)
              })
              it('should not add the matched resources', function () {
                expect(processedResponse.data.included).to.deep.equal([
                  {
                    id: 'foo',
                    type: 'foos',
                  },
                  {
                    id: 'bar',
                    type: 'bars',
                  },
                ])
              })
            }
          )

          context('when response has no pre-existing included', function () {
            beforeEach(function () {
              delete response.data.included
              processedResponse = middleware.req(response)
            })
            it('should still add the matched resources', function () {
              expect(processedResponse.data.included).to.deep.equal([
                {
                  id: 'bar',
                  type: 'bars',
                },
              ])
            })
          })

          context('when matched resources already in included', function () {
            beforeEach(function () {
              findUnpopulatedResourcesStub.returns([
                {
                  id: 'foo',
                  type: 'foos',
                },
              ])
              processedResponse = middleware.req(response)
            })
            it('should not add the matched resources', function () {
              expect(processedResponse.data.included).to.deep.equal([
                {
                  id: 'foo',
                  type: 'foos',
                },
              ])
            })
          })
        })
      })
    })
  })
})
