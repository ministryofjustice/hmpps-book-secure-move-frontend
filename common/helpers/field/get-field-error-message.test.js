const i18n = require('../../../config/i18n')

const getFieldErrorMessage = require('./get-field-error-message')

describe('Field helpers', function () {
  describe('#getFieldErrorMessage()', function () {
    const mockFieldKey = 'first_name'
    const mockErrorType = 'required'
    let errorMessage

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      i18n.t
        .withArgs([
          `fields::${mockFieldKey}.error_message`,
          `validation::${mockErrorType}`,
        ])
        .returns('This field is not valid')
      errorMessage = getFieldErrorMessage(mockFieldKey, mockErrorType)
    })

    it('should translate label with error context', function () {
      expect(i18n.t).to.be.calledWithExactly(`fields::${mockFieldKey}.label`, {
        context: 'with_error',
      })
    })

    it('should translate fallback label with label context', function () {
      expect(i18n.t).to.be.calledWithExactly(`validation::${mockErrorType}`, {
        context: 'with_label',
        label: `fields::${mockFieldKey}.label`,
      })
    })

    it('should translate with order preference', function () {
      expect(i18n.t).to.be.calledWithExactly(
        [
          `fields::${mockFieldKey}.error_message`,
          `validation::${mockErrorType}`,
        ],
        {
          context: mockErrorType,
        }
      )
    })

    it('should return error message', function () {
      expect(errorMessage).to.deep.equal('This field is not valid')
    })
  })
})
