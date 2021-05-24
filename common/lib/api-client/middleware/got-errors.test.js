const errorMiddleware = require('./got-errors')

describe('API Client', function () {
  describe('Got errors middleware', function () {
    describe('#error()', function () {
      context('when payload does not include a response', function () {
        context('when payload is an Error', function () {
          it('should return error', function () {
            const error = errorMiddleware.error(new Error('Payload error'))

            expect(error).to.be.an.instanceOf(Error)
            expect(error.message).to.equal('Payload error')
          })
        })

        context('when payload is not an Error', function () {
          it('should return null', function () {
            expect(errorMiddleware.error()).to.equal(null)
          })
        })
      })

      context('when payload contains a response', function () {
        let response

        before(function () {
          response = {
            statusMessage: 'API Error',
          }
        })

        context('without error description', function () {
          it('should set message to statusMessage', function () {
            const error = errorMiddleware.error({ response })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.message).to.equal('API Error')
          })
        })

        context('with error description', function () {
          it('should set message to error description', function () {
            const error = errorMiddleware.error({
              response: {
                ...response,
                body: {
                  error_description: 'Error description',
                },
              },
            })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.message).to.equal('Error description')
          })
        })

        context('without response status', function () {
          it('should set status to 500', function () {
            const error = errorMiddleware.error({ response })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.statusCode).to.equal(500)
          })
        })

        context('with response status', function () {
          it('should set status to response status', function () {
            const error = errorMiddleware.error({
              response: {
                ...response,
                statusCode: 422,
              },
            })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.statusCode).to.equal(422)
          })
        })

        context('without data errors', function () {
          it('should set errors to undefined', function () {
            const error = errorMiddleware.error({ response })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.errors).to.be.undefined
          })
        })

        context('with data errors', function () {
          let error

          beforeEach(function () {
            error = errorMiddleware.error({
              response: {
                ...response,
                statusCode: 422,
                body: {
                  errors: [
                    {
                      name: 'Error 1',
                      title: 'Error title 1',
                    },
                    {
                      name: 'Error 2',
                      title: 'Error title 2',
                    },
                  ],
                },
              },
            })
          })

          it('should append errors to error class', function () {
            expect(error).to.be.an.instanceOf(Error)
            expect(error.errors).to.deep.equal([
              {
                name: 'Error 1',
                title: 'Error title 1',
              },
              {
                name: 'Error 2',
                title: 'Error title 2',
              },
            ])
          })

          it('should update error message', function () {
            expect(error).to.be.an.instanceOf(Error)
            expect(error.message).to.deep.equal('API Error: Error title 1')
          })
        })
      })
    })
  })
})
