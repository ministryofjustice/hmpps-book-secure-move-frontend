const errorMiddleware = require('./errors')

describe('API Client', function () {
  describe('Error middleware', function () {
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
            statusText: 'API Error',
          }
        })

        context('without error description', function () {
          it('should set message to statusText', function () {
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
                data: {
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
                status: 422,
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
          it('should append errors to error class', function () {
            const error = errorMiddleware.error({
              response: {
                ...response,
                data: {
                  errors: [
                    {
                      name: 'Error 1',
                    },
                    {
                      name: 'Error 2',
                    },
                  ],
                },
              },
            })

            expect(error).to.be.an.instanceOf(Error)
            expect(error.errors).to.deep.equal([
              {
                name: 'Error 1',
              },
              {
                name: 'Error 2',
              },
            ])
          })
        })
      })
    })
  })
})
