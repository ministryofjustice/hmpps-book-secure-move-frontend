const i18n = require('../../../config/i18n').default

const getFieldErrorMessage = require('./get-field-error-message')

describe('Field helpers', function () {
  describe('#getFieldErrorMessage()', function () {
    const mockFieldError = {
      key: 'first_name',
      type: 'required',
      objectType: 'move',
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
          [`fields::${mockFieldError.key}.label`, ''],
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
            label: [`fields::${mockFieldError.key}.label`, ''],
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
            objectType: mockFieldError.object,
          }
        )
      })

      it('should return error message', function () {
        expect(errorMessage).to.deep.equal('This field is not valid')
      })
    })

    context('with missing error message', function () {
      context('with description', function () {
        beforeEach(function () {
          errorMessage = getFieldErrorMessage({
            ...mockFieldError,
            description: 'Field name',
            question: 'What is life?',
          })
        })

        it('should translate label with error context', function () {
          expect(i18n.t).to.be.calledWithExactly(
            [`fields::${mockFieldError.key}.label`, 'Field name'],
            {
              context: 'with_error',
              objectType: 'move',
            }
          )
        })

        it('should translate fallback label with label context', function () {
          expect(i18n.t).to.be.calledWithExactly(
            `validation::${mockFieldError.type}`,
            {
              context: 'with_label',
              objectType: 'move',
              label: [`fields::${mockFieldError.key}.label`, 'Field name'],
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

      context('without description', function () {
        beforeEach(function () {
          errorMessage = getFieldErrorMessage({
            ...mockFieldError,
            question: 'What is life?',
          })
        })

        it('should translate label with error context', function () {
          expect(i18n.t).to.be.calledWithExactly(
            [`fields::${mockFieldError.key}.label`, 'What is life?'],
            {
              context: 'with_error',
              objectType: 'move',
            }
          )
        })

        it('should translate fallback label with label context', function () {
          expect(i18n.t).to.be.calledWithExactly(
            `validation::${mockFieldError.type}`,
            {
              context: 'with_label',
              label: [`fields::${mockFieldError.key}.label`, 'What is life?'],
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
              objectType: 'move',
            }
          )
        })

        it('should return error message', function () {
          expect(errorMessage).to.deep.equal('This field is not valid')
        })
      })
    })
  })
})
