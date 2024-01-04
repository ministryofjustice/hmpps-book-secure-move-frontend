const { pick } = require('lodash')

const responseMiddleware = require('./got-response')

describe('API Client', function () {
  describe('Got response middleware', function () {
    describe('#res()', function () {
      let payload, response

      beforeEach(function () {
        payload = {
          jsonApi: {
            deserialize: {
              collection: sinon.stub().callsFake(data => data.attributes),
              resource: sinon.stub().callsFake(data => data.attributes),
              cache: {
                clear: sinon.stub().returns(true),
              },
            },
          },
          req: {
            method: 'GET',
          },
          res: {
            body: {
              data: {
                id: '12345',
                attributes: {
                  foo: 'bar',
                },
              },
              errors: {
                fizz: 'buzz',
              },
              meta: {
                fizz: 'buzz',
              },
              links: {
                prev: null,
                next: '?page=2',
              },
              included: [
                {
                  id: 'dfa3ba99-10be-4bc6-bd7d-33cd99d2b48a',
                  type: 'locations',
                  attributes: {
                    key: 'vei',
                    title: 'The Verne Immigration Removal Centre',
                    location_type: 'prison',
                    nomis_agency_id: 'VEI',
                    can_upload_documents: false,
                    disabled_at: null,
                  },
                  relationships: {
                    suppliers: {
                      data: [],
                    },
                  },
                },
                {
                  id: '87c3b4a6-43ff-4e30-bf3f-19e60d020293',
                  type: 'locations',
                  attributes: {
                    key: 'sni',
                    title: 'SWINFEN HALL (HMP)',
                    location_type: 'prison',
                    nomis_agency_id: 'SNI',
                    can_upload_documents: false,
                    disabled_at: null,
                  },
                  relationships: {
                    suppliers: {
                      data: [],
                    },
                  },
                },
              ],
            },
          },
        }
      })

      context('with 204 status code', function () {
        beforeEach(function () {
          payload.res.status = 204
          response = responseMiddleware.res(payload)
        })

        it('should not deserialize the data', function () {
          expect(payload.jsonApi.deserialize.collection).not.have.been.called
          expect(payload.jsonApi.deserialize.resource).not.have.been.called
        })

        it('should not clear cache', function () {
          expect(payload.jsonApi.deserialize.cache.clear).not.have.been.called
        })

        it('should not return serialized data', function () {
          expect(response).to.deep.equal({
            ...pick(payload.res.body, ['errors', 'meta', 'links']),
            data: null,
          })
        })
      })

      describe('status codes', function () {
        const testCases = [
          {
            method: 'GET',
            shouldDeserialize: true,
          },
          {
            method: 'get',
            shouldDeserialize: true,
          },
          {
            method: 'PATCH',
            shouldDeserialize: true,
          },
          {
            method: 'patch',
            shouldDeserialize: true,
          },
          {
            method: 'POST',
            shouldDeserialize: true,
          },
          {
            method: 'post',
            shouldDeserialize: true,
          },
          {
            method: 'DELETE',
            shouldDeserialize: false,
          },
          {
            method: 'delete',
            shouldDeserialize: false,
          },
        ]

        context('with a single resource', function () {
          testCases.forEach(testCase => {
            context(`with ${testCase.method}`, function () {
              beforeEach(function () {
                payload.req.method = testCase.method
                response = responseMiddleware.res(payload)
              })

              it('should not deserialize as a collection', function () {
                expect(payload.jsonApi.deserialize.collection).not.have.been
                  .called
              })

              if (testCase.shouldDeserialize) {
                it('should deserialize the data as a resource', function () {
                  expect(
                    payload.jsonApi.deserialize.resource
                  ).to.have.been.calledOn(payload.jsonApi)

                  expect(
                    payload.jsonApi.deserialize.resource
                  ).to.have.been.calledOnceWithExactly(
                    payload.res.body.data,
                    payload.res.body.included
                  )
                })

                it('should clear cache', function () {
                  expect(
                    payload.jsonApi.deserialize.cache.clear
                  ).to.have.been.calledOnceWithExactly()
                })

                it('should contain correct data properties', function () {
                  expect(response.data).to.have.own.property('foo')
                  expect(response.data).to.not.have.own.property('meta')
                  expect(response.data).to.not.have.own.property('links')
                })
              } else {
                it('should not deserialize as a resource', function () {
                  expect(payload.jsonApi.deserialize.resource).not.have.been
                    .called
                })
              }

              it('should return serialized data', function () {
                expect(response).to.deep.equal({
                  ...pick(payload.res.body, ['errors', 'meta', 'links']),
                  data: testCase.shouldDeserialize
                    ? payload.res.body.data.attributes
                    : null,
                })
              })
            })
          })
        })

        context('with a collection', function () {
          beforeEach(function () {
            payload.res.body.data = [payload.res.body.data]
          })

          testCases.forEach(testCase => {
            context(`with ${testCase.method}`, function () {
              beforeEach(function () {
                payload.req.method = testCase.method
                response = responseMiddleware.res(payload)
              })

              it('should not deserialize as a resource', function () {
                expect(payload.jsonApi.deserialize.resource).not.have.been
                  .called
              })

              if (testCase.shouldDeserialize) {
                it('should deserialize the data as a collection', function () {
                  expect(
                    payload.jsonApi.deserialize.collection
                  ).to.have.been.calledOn(payload.jsonApi)

                  expect(
                    payload.jsonApi.deserialize.collection
                  ).to.have.been.calledOnceWithExactly(
                    payload.res.body.data,
                    payload.res.body.included
                  )
                })

                it('should clear cache', function () {
                  expect(
                    payload.jsonApi.deserialize.cache.clear
                  ).to.have.been.calledOnceWithExactly()
                })
              } else {
                it('should not deserialize as a collection', function () {
                  expect(payload.jsonApi.deserialize.collection).not.have.been
                    .called
                })
              }

              it('should return serialized data', function () {
                expect(response).to.deep.equal({
                  ...pick(payload.res.body, ['errors', 'meta', 'links']),
                  data: testCase.shouldDeserialize
                    ? payload.res.body.data.attributes
                    : null,
                })
              })
            })
          })
        })
      })

      context('with extra resource properties', function () {
        beforeEach(function () {
          payload.res.body.data.meta = {
            foo: 'bar',
          }
          payload.res.body.data.links = {
            self: 'http://hello.com',
          }
          payload.res.body.data.fizz = 'buzz'

          response = responseMiddleware.res(payload)
        })

        it('should deserialize the data as a resource', function () {
          expect(payload.jsonApi.deserialize.resource).to.have.been.calledOn(
            payload.jsonApi
          )

          expect(
            payload.jsonApi.deserialize.resource
          ).to.have.been.calledOnceWithExactly(
            payload.res.body.data,
            payload.res.body.included
          )
        })

        it('should clear cache', function () {
          expect(
            payload.jsonApi.deserialize.cache.clear
          ).to.have.been.calledOnceWithExactly()
        })

        it('should return serialized data', function () {
          expect(response).to.deep.equal({
            ...pick(payload.res.body, ['errors', 'meta', 'links']),
            data: payload.res.body.data.attributes,
          })
        })

        it('should contain correct data properties', function () {
          expect(response.data).to.have.own.property('foo')
          expect(response.data).to.have.own.property('meta')
          expect(response.data).to.have.own.property('links')
          expect(response.data).to.not.have.own.property('fizz')
        })
      })

      context('without data', function () {
        beforeEach(function () {
          payload.res.body.data = undefined
          response = responseMiddleware.res(payload)
        })

        it('should not deserialize the data', function () {
          expect(payload.jsonApi.deserialize.collection).not.have.been.called
          expect(payload.jsonApi.deserialize.resource).not.have.been.called
        })

        it('should clear the cache', function () {
          expect(
            payload.jsonApi.deserialize.cache.clear
          ).to.have.been.calledOnceWithExactly()
        })

        it('should return unserialized data', function () {
          expect(response).to.deep.equal({
            ...pick(payload.res.body, ['errors', 'meta', 'links']),
            data: null,
          })
        })
      })

      context('without body properties', function () {
        beforeEach(function () {
          payload.res.body = undefined
          response = responseMiddleware.res(payload)
        })

        it('should not deserialize the data', function () {
          expect(payload.jsonApi.deserialize.collection).not.have.been.called
          expect(payload.jsonApi.deserialize.resource).not.have.been.called
        })

        it('should not return serialized data', function () {
          expect(response).to.deep.equal({
            errors: undefined,
            links: undefined,
            meta: undefined,
            data: null,
          })
        })
      })
    })
  })
})
