const FormData = require('form-data')

const middleware = require('./got-request-transformer')

describe('API Client', function () {
  describe('Got request transformer middleware', function () {
    describe('#req', function () {
      context('when payload includes a response', function () {
        it('should return payload as is', function () {
          const payload = { req: {}, res: {} }
          expect(middleware.req(payload)).to.deep.equal({ ...payload })
        })
      })

      context('when payload contains a request', function () {
        let payload, response

        beforeEach(function () {
          payload = {
            req: {},
          }
        })

        describe('options', function () {
          beforeEach(function () {
            payload.req = {
              data: {
                data: {
                  id: '12345',
                },
              },
              params: {
                foo: 'bar',
                include: 'books,author',
                page: 1,
              },
              fizz: 'buzz',
            }

            response = middleware.req(payload)
          })

          it('should remove unwanted property', function () {
            expect(response.req).not.to.have.property('params')
            expect(response.req).not.to.have.property('data')
          })

          it('should set responseType', function () {
            expect(response.req).to.have.property('responseType')
            expect(response.req.responseType).to.equal('json')
          })
        })

        context('with existing request params', function () {
          beforeEach(function () {
            payload.req.params = {
              foo: 'bar',
              include: 'books,author',
              page: 1,
            }

            response = middleware.req(payload)
          })

          it('should copy `params` to `searchParams`', function () {
            expect(response.req.searchParams).to.deep.equal(payload.req.params)
          })

          it('should not contain `params`', function () {
            expect(response.req).not.to.have.property('params')
          })
        })

        context('with existing request data', function () {
          context('with data is form-data', function () {
            beforeEach(function () {
              payload.req.data = new FormData()

              response = middleware.req(payload)
            })

            it('should copy `data` to `body`', function () {
              expect(response.req.body).to.deep.equal(payload.req.data)
            })

            it('should not contain `data`', function () {
              expect(response.req).not.to.have.property('data')
            })
          })

          context('with data is not form-data', function () {
            beforeEach(function () {
              payload.req.data = {
                foo: 'bar',
                id: '12345',
              }

              response = middleware.req(payload)
            })

            it('should copy `data` to `json`', function () {
              expect(response.req.json).to.deep.equal(payload.req.data)
            })

            it('should not contain `data`', function () {
              expect(response.req).not.to.have.property('data')
            })
          })
        })
      })
    })
  })
})
