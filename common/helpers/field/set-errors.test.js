const setErrors = require('./set-errors')

describe('Field helpers', function () {
  describe('#setErrors()', function () {
    let errors

    beforeEach(function () {})

    context('when there are no errors', function () {
      context('and no errors existed before', function () {
        beforeEach(function () {
          errors = setErrors([])
        })

        it('should return expected errors', function () {
          expect(errors).to.deep.equal({})
        })
      })

      context('and errors existed before', function () {
        beforeEach(function () {
          errors = setErrors([], { foo: 'bar' })
        })

        it('should return previous errors untouched', function () {
          expect(errors).to.deep.equal({ foo: 'bar' })
        })
      })
    })

    context('when there are errors', function () {
      const fieldErrors = [
        {
          key: 'x',
          type: 'bogus',
          url: '/bogosity',
          args: { innerx: true },
          other_arg: 'some value',
        },
      ]
      context('and no errors existed before', function () {
        beforeEach(function () {
          errors = setErrors(fieldErrors)
        })

        it('should return errors with expected keys', function () {
          expect(errors).to.deep.equal({
            x: {
              key: 'x',
              type: 'bogus',
              url: '/bogosity',
              args: { innerx: true },
            },
          })
        })
      })

      context('and errors existed before', function () {
        beforeEach(function () {
          errors = setErrors(fieldErrors, { foo: 'bar' })
        })

        it('should return errors with new errors', function () {
          expect(errors).to.deep.equal({
            x: {
              key: 'x',
              type: 'bogus',
              url: '/bogosity',
              args: { innerx: true },
            },
            foo: 'bar',
          })
        })
      })

      context('and multiple field error values are passed', function () {
        beforeEach(function () {
          errors = setErrors([
            ...fieldErrors,
            {
              key: 'y',
              type: 'invalid',
              url: '/invalidity',
              args: { innerx: false },
            },
          ])
        })

        it('should return the errors for all the fields', function () {
          expect(errors).to.deep.equal({
            x: {
              key: 'x',
              type: 'bogus',
              url: '/bogosity',
              args: { innerx: true },
            },
            y: {
              key: 'y',
              type: 'invalid',
              url: '/invalidity',
              args: { innerx: false },
            },
          })
        })
      })

      context(
        'and multiple error values are passed for a single field',
        function () {
          beforeEach(function () {
            errors = setErrors([
              ...fieldErrors,
              {
                key: 'x',
                type: 'invalid',
                url: '/invalidity',
                args: { innerx: false },
              },
            ])
          })

          it('should return only last set error for field', function () {
            expect(errors).to.deep.equal({
              x: {
                key: 'x',
                type: 'invalid',
                url: '/invalidity',
                args: { innerx: false },
              },
            })
          })
        }
      )

      context('and no value is passed for args', function () {
        beforeEach(function () {
          errors = setErrors([
            {
              key: 'x',
              type: 'invalid',
              url: '/invalidity',
            },
          ])
        })

        it('should return set args prop to an empty object', function () {
          expect(errors).to.deep.equal({
            x: {
              key: 'x',
              type: 'invalid',
              url: '/invalidity',
              args: {},
            },
          })
        })
      })
    })

    context('when a request object is passed', function () {
      const req = {
        originalUrl: '/original-url',
      }

      context('and the field error has a url', function () {
        beforeEach(function () {
          errors = setErrors(
            [
              {
                key: 'x',
                type: 'bogus',
                url: '/bogosity',
                args: { innerx: true },
              },
            ],
            {},
            req
          )
        })

        it('should not override url passed in field error', function () {
          expect(errors).to.deep.equal({
            x: {
              key: 'x',
              type: 'bogus',
              url: '/bogosity',
              args: { innerx: true },
            },
          })
        })
      })
    })
  })
})
