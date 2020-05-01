const proxyquire = require('proxyquire')

const getFieldErrorMessageStub = sinon.stub().returns('Error message')
const setFieldError = proxyquire('./set-field-error', {
  './get-field-error-message': getFieldErrorMessageStub,
})

describe('Field helpers', function() {
  describe('#setFieldError()', function() {
    context('when no error exists', function() {
      let response
      const field = ['field', { name: 'field' }]

      beforeEach(function() {
        response = setFieldError({})(field)
      })

      it('should not call translation method', function() {
        expect(getFieldErrorMessageStub).not.to.be.called
      })

      it('should return original field', function() {
        expect(response).to.deep.equal(field)
      })
    })

    context('when error exists', function() {
      const errors = {
        error_field: {
          type: 'required',
          key: 'error_field',
        },
      }
      let field, response

      beforeEach(function() {
        field = ['error_field', { name: 'error_field' }]
        response = setFieldError(errors)(field)
      })

      it('should get the error message', function() {
        expect(getFieldErrorMessageStub).to.be.calledOnceWithExactly(
          'error_field',
          'required'
        )
      })

      it('should return field with error message', function() {
        expect(response).to.deep.equal([
          'error_field',
          {
            name: 'error_field',
            errorMessage: {
              html: 'Error message',
            },
          },
        ])
      })

      it('should not mutate original field', function() {
        expect(field).to.deep.equal(['error_field', { name: 'error_field' }])
      })
    })
  })
})
