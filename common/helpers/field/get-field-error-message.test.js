const i18n = require('../../../config/i18n')

const getFieldErrorMessage = require('./get-field-error-message')

describe('Field helpers', function () {
  describe('#getFieldErrorMessage()', function () {
    const mockFieldError = {
      key: 'first_name',
      type: 'required',
    }
    let errorMessage

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      i18n.t
        .withArgs([
          `fields::${mockFieldError.key}.error_message`,
          `validation::${mockFieldError.type}`,
        ])
        .returns('This field is not valid')
    })

    context('with no argument', function () {
      it('should return empty string', function () {
        const errorMessage = getFieldErrorMessage()
        expect(errorMessage).to.equal('')
      })
    })

    context('with custom error message', function () {
      beforeEach(function () {
        errorMessage = getFieldErrorMessage({
          ...mockFieldError,
          message: 'Custom error message',
        })
      })

      it('should translate label with error context', function () {
        expect(errorMessage).to.equal('Custom error message')
      })
    })

    context('without custom error message', function () {
      beforeEach(function () {
        errorMessage = getFieldErrorMessage(mockFieldError)
      })

      it('should translate label with error context', function () {
        expect(i18n.t).to.be.calledWithExactly(
          `fields::${mockFieldError.key}.label`,
          {
            context: 'with_error',
          }
        )
      })

      it('should translate fallback label with label context', function () {
        expect(i18n.t).to.be.calledWithExactly(
          `validation::${mockFieldError.type}`,
          {
            context: 'with_label',
            label: `fields::${mockFieldError.key}.label`,
          }
        )
      })

      it('should translate with order preference', function () {
        expect(i18n.t).to.be.calledWithExactly(
          [
            `fields::${mockFieldError.key}.error_message`,
            `validation::${mockFieldError.type}`,
          ],
          {
            context: mockFieldError.type,
          }
        )
      })

      it('should return error message', function () {
        expect(errorMessage).to.deep.equal('This field is not valid')
      })
    })
  })
})
