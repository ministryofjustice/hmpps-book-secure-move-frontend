const proxyquire = require('proxyquire')

const getFieldErrorMessageStub = sinon.stub().callsFake(error => {
  return `${error.key}.${error.type}`
})
const addErrorListToErrors = proxyquire('./add-errorlist-to-errors', {
  './get-field-error-message': getFieldErrorMessageStub,
})

describe('Field helpers', function () {
  describe('#addErrorListToErrors()', function () {
    let errors
    let mockFields = {
      fieldOne: {
        id: 'field-one',
      },
      fieldTwo: {
        id: 'field-two',
      },
      fieldThree: {
        id: 'field-three',
      },
    }
    beforeEach(function () {
      getFieldErrorMessageStub.resetHistory()
    })

    context('when there are no errors', function () {
      const mockErrors = undefined

      beforeEach(function () {
        errors = addErrorListToErrors(mockErrors, mockFields)
      })

      it('should contain no errors', function () {
        expect(errors.errorList.length).to.equal(0)
      })

      it('should not get error messages', function () {
        expect(getFieldErrorMessageStub.callCount).to.equal(0)
      })

      it('should transform errors object and add empty errorList property', function () {
        expect(errors).to.deep.equal({
          errorList: [],
        })
      })
    })

    context('when there are errors', function () {
      const mockErrors = {
        fieldOne: {
          key: 'fieldOne',
          type: 'required',
          url: '/step-url',
        },
        fieldTwo: {
          key: 'fieldTwo',
          type: 'before',
          url: '/step-url',
        },
      }

      beforeEach(function () {
        errors = addErrorListToErrors(mockErrors, mockFields)
      })

      it('should contain correct number of errors', function () {
        expect(errors.errorList.length).to.equal(2)
      })

      it('should get error messages for fields that have errors', function () {
        expect(getFieldErrorMessageStub).to.be.calledWithExactly({
          ...mockFields.fieldOne,
          ...mockErrors.fieldOne,
        })
        expect(getFieldErrorMessageStub).to.be.calledWithExactly({
          ...mockFields.fieldTwo,
          ...mockErrors.fieldTwo,
        })
      })

      it('should get error messages correct number of times', function () {
        expect(getFieldErrorMessageStub.callCount).to.equal(2)
      })

      it('should transform errors object and add errorList property', function () {
        expect(errors).to.deep.equal({
          ...mockErrors,
          errorList: [
            {
              href: `#${mockFields.fieldOne.id}`,
              html: `${mockErrors.fieldOne.key}.${mockErrors.fieldOne.type}`,
            },
            {
              href: `#${mockFields.fieldTwo.id}`,
              html: `${mockErrors.fieldTwo.key}.${mockErrors.fieldTwo.type}`,
            },
          ],
        })
      })
    })

    context('when there are property bag errors', function () {
      mockFields = {
        fieldOne: {
          id: 'field-one',
          prefix: 'property-bags[0]',
        },
        fieldTwo: {
          id: 'field-two',
          prefix: 'property-bags[1]',
        },
      }

      const mockErrors = {
        fieldOne: {
          key: 'fieldOne',
          message: 'Enter the seal number',
          type: 'required',
          url: '/step-url',
        },
        fieldTwo: {
          key: 'fieldTwo',
          message: 'Select the types of property',
          type: 'required',
          url: '/step-url',
        },
      }

      beforeEach(function () {
        errors = addErrorListToErrors(mockErrors, mockFields)
      })

      it('should contain correct number of errors', function () {
        expect(errors.errorList.length).to.equal(2)
      })

      it('should get error messages for fields that have errors', function () {
        expect(getFieldErrorMessageStub).to.be.calledWithExactly({
          ...mockFields.fieldOne,
          ...mockErrors.fieldOne,
        })
        expect(getFieldErrorMessageStub).to.be.calledWithExactly({
          ...mockFields.fieldTwo,
          ...mockErrors.fieldTwo,
        })
      })

      it('should get error messages with the correct args', function () {
        expect(getFieldErrorMessageStub.getCall(0).firstArg.message).to.equal(
          'Enter the seal number for bag 1'
        )
        expect(getFieldErrorMessageStub.getCall(1).firstArg.message).to.equal(
          'Select the types of property for bag 2'
        )
      })

      it('should transform errors object and add errorList property', function () {
        expect(errors).to.deep.equal({
          ...mockErrors,
          errorList: [
            {
              href: `#${mockFields.fieldOne.id}`,
              html: `${mockErrors.fieldOne.key}.${mockErrors.fieldOne.type}`,
            },
            {
              href: `#${mockFields.fieldTwo.id}`,
              html: `${mockErrors.fieldTwo.key}.${mockErrors.fieldTwo.type}`,
            },
          ],
        })
      })
    })
  })
})
