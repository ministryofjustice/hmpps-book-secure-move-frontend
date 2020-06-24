const Sentry = require('@sentry/node')
const FormController = require('hmpo-form-wizard').Controller

const fieldHelpers = require('../helpers/field')

const Controller = require('./form-wizard')

const controller = new Controller({ route: '/' })

describe('Form wizard', function () {
  describe('#middlewareSetup()', function () {
    beforeEach(function () {
      sinon.stub(FormController.prototype, 'middlewareSetup')
      sinon.stub(controller, 'use')

      controller.middlewareSetup()
    })

    it('should call parent method', function () {
      expect(FormController.prototype.middlewareSetup).to.have.been.calledOnce
    })

    it('should call set previous assessment method', function () {
      expect(controller.use.firstCall).to.have.been.calledWithExactly(
        controller.setupConditionalFields
      )
    })

    it('should call correct number of middleware', function () {
      expect(controller.use).to.be.callCount(1)
    })
  })

  describe('#setupConditionalFields()', function () {
    let mockReq, nextSpy
    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {
        form: {
          options: {
            allFields: {
              foo: {
                name: 'foo',
              },
              bar: {
                name: 'bar',
              },
            },
            fields: {},
          },
        },
      }
    })

    context('when field does not have items', function () {
      beforeEach(function () {
        mockReq.form.options.fields.simpleField = {
          name: 'simple-field',
        }

        controller.setupConditionalFields(mockReq, {}, nextSpy)
      })

      it('should not add any dependent fields', function () {
        expect(mockReq.form.options.fields).to.deep.equal({
          simpleField: {
            name: 'simple-field',
          },
        })
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when field has items', function () {
      context('with no conditional values', function () {
        beforeEach(function () {
          mockReq.form.options.fields.optionsFields = {
            name: 'options-field',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
              },
            ],
          }

          controller.setupConditionalFields(mockReq, {}, nextSpy)
        })

        it('should not add any dependent fields', function () {
          expect(mockReq.form.options.fields).to.deep.equal({
            optionsFields: {
              name: 'options-field',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                },
              ],
            },
          })
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when conditional is a string', function () {
        beforeEach(function () {
          mockReq.form.options.fields.optionsFields = {
            name: 'options-field',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: 'conditionalField',
              },
            ],
          }
        })

        context('when conditional field does not exist', function () {
          beforeEach(function () {
            controller.setupConditionalFields(mockReq, {}, nextSpy)
          })

          it('should not add any dependent fields', function () {
            expect(mockReq.form.options.fields).to.deep.equal({
              optionsFields: {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: 'conditionalField',
                  },
                ],
              },
            })
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when conditional field exists', function () {
          beforeEach(function () {
            mockReq.form.options.allFields.conditionalField = {
              name: 'conditional-field',
            }

            controller.setupConditionalFields(mockReq, {}, nextSpy)
          })

          it('should add any dependent field', function () {
            expect(mockReq.form.options.fields).to.deep.equal({
              optionsFields: {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: 'conditionalField',
                  },
                ],
              },
              conditionalField: {
                name: 'conditional-field',
                skip: true,
                dependent: {
                  field: 'optionsFields',
                  value: 'item-one',
                },
              },
            })
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })

      context('when conditional is an array', function () {
        beforeEach(function () {
          mockReq.form.options.fields.optionsFields = {
            name: 'options-field',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: ['conditionalField1', 'conditionalField2'],
              },
            ],
          }
        })

        context('when conditional fields do not exist', function () {
          beforeEach(function () {
            controller.setupConditionalFields(mockReq, {}, nextSpy)
          })

          it('should not add any dependent fields', function () {
            expect(mockReq.form.options.fields).to.deep.equal({
              optionsFields: {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditionalField1', 'conditionalField2'],
                  },
                ],
              },
            })
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('when conditional field exists', function () {
          beforeEach(function () {
            mockReq.form.options.allFields.conditionalField1 = {
              name: 'conditional-field-1',
            }
            mockReq.form.options.allFields.conditionalField2 = {
              name: 'conditional-field-2',
            }

            controller.setupConditionalFields(mockReq, {}, nextSpy)
          })

          it('should add any dependent field', function () {
            expect(mockReq.form.options.fields).to.deep.equal({
              optionsFields: {
                name: 'options-field',
                items: [
                  {
                    label: 'Item one',
                    value: 'item-one',
                    conditional: ['conditionalField1', 'conditionalField2'],
                  },
                ],
              },
              conditionalField1: {
                name: 'conditional-field-1',
                skip: true,
                dependent: {
                  field: 'optionsFields',
                  value: 'item-one',
                },
              },
              conditionalField2: {
                name: 'conditional-field-2',
                skip: true,
                dependent: {
                  field: 'optionsFields',
                  value: 'item-one',
                },
              },
            })
          })

          it('should call next without error', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    context('with multiple fields and conditionals', function () {
      beforeEach(function () {
        mockReq.form.options.fields = {
          optionsField1: {
            name: 'options-field-1',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: ['conditionalField1', 'conditionalField2'],
              },
            ],
          },
          optionsField2: {
            name: 'options-field-2',
            items: [
              {
                label: 'Item one',
                value: 'item-one',
                conditional: 'conditionalField3',
              },
              {
                label: 'Item two',
                value: 'item-two',
                conditional: ['conditionalField4', 'conditionalField5'],
              },
            ],
          },
        }
        mockReq.form.options.allFields = {
          ...mockReq.form.options.allFields,
          conditionalField1: {
            name: 'conditional-field-1',
          },
          conditionalField2: {
            name: 'conditional-field-2',
          },
          conditionalField3: {
            name: 'conditional-field-3',
          },
          conditionalField4: {
            name: 'conditional-field-4',
          },
          conditionalField5: {
            name: 'conditional-field-5',
          },
        }

        controller.setupConditionalFields(mockReq, {}, nextSpy)
      })

      context('when conditional field exists', function () {
        it('should add any dependent fields', function () {
          expect(mockReq.form.options.fields).to.deep.equal({
            optionsField1: {
              name: 'options-field-1',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                  conditional: ['conditionalField1', 'conditionalField2'],
                },
              ],
            },
            optionsField2: {
              name: 'options-field-2',
              items: [
                {
                  label: 'Item one',
                  value: 'item-one',
                  conditional: 'conditionalField3',
                },
                {
                  label: 'Item two',
                  value: 'item-two',
                  conditional: ['conditionalField4', 'conditionalField5'],
                },
              ],
            },
            conditionalField1: {
              name: 'conditional-field-1',
              skip: true,
              dependent: {
                field: 'optionsField1',
                value: 'item-one',
              },
            },
            conditionalField2: {
              name: 'conditional-field-2',
              skip: true,
              dependent: {
                field: 'optionsField1',
                value: 'item-one',
              },
            },
            conditionalField3: {
              name: 'conditional-field-3',
              skip: true,
              dependent: {
                field: 'optionsField2',
                value: 'item-one',
              },
            },
            conditionalField4: {
              name: 'conditional-field-4',
              skip: true,
              dependent: {
                field: 'optionsField2',
                value: 'item-two',
              },
            },
            conditionalField5: {
              name: 'conditional-field-5',
              skip: true,
              dependent: {
                field: 'optionsField2',
                value: 'item-two',
              },
            },
          })
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })
  })

  describe('#getErrors()', function () {
    let errors

    beforeEach(function () {
      sinon
        .stub(fieldHelpers, 'getFieldErrorMessage')
        .callsFake((key, type) => {
          return `${key}.${type}`
        })
      sinon.stub(FormController.prototype, 'getErrors')
    })

    context('when parent returns empty errors object', function () {
      beforeEach(function () {
        FormController.prototype.getErrors.returns({})
        errors = controller.getErrors({}, {})
      })

      it('should set an empty error list property', function () {
        expect(errors.errorList.length).to.equal(0)
      })
    })

    context('when parent returns an errors object', function () {
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
        FormController.prototype.getErrors.returns(mockErrors)
        const reqMock = {
          t: sinon.stub().returnsArg(0),
        }
        errors = controller.getErrors(reqMock, {})
      })

      it('should contain correct number of errors', function () {
        expect(errors.errorList.length).to.equal(2)
      })

      it('should get error messages', function () {
        expect(fieldHelpers.getFieldErrorMessage).to.be.calledWithExactly(
          mockErrors.fieldOne.key,
          mockErrors.fieldOne.type
        )
        expect(fieldHelpers.getFieldErrorMessage).to.be.calledWithExactly(
          mockErrors.fieldTwo.key,
          mockErrors.fieldTwo.type
        )
      })

      it('should get error messages correct number of times', function () {
        expect(fieldHelpers.getFieldErrorMessage.callCount).to.equal(2)
      })

      it('should transform and append messages property', function () {
        expect(errors).to.deep.equal({
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
          errorList: [
            {
              href: `#${mockErrors.fieldOne.key}`,
              html: `${mockErrors.fieldOne.key}.${mockErrors.fieldOne.type}`,
            },
            {
              href: `#${mockErrors.fieldTwo.key}`,
              html: `${mockErrors.fieldTwo.key}.${mockErrors.fieldTwo.type}`,
            },
          ],
        })
      })
    })
  })

  describe('#errorHandler()', function () {
    let errorMock, resMock

    beforeEach(function () {
      errorMock = new Error()
      resMock = {
        redirect: sinon.spy(),
        render: sinon.spy(),
      }
      sinon.spy(FormController.prototype, 'errorHandler')
    })

    context('when a redirect property is set', function () {
      beforeEach(function () {
        errorMock.code = 'MISSING_PREREQ'
        errorMock.redirect = '/error-redirect-path/'

        controller.errorHandler(errorMock, {}, resMock)
      })

      it('redirect to specified value', function () {
        expect(resMock.redirect).to.be.calledWith(errorMock.redirect)
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns session timeout error', function () {
      let reqMock

      beforeEach(function () {
        errorMock.code = 'SESSION_TIMEOUT'
        reqMock = {
          baseUrl: '/journey-base-url',
          form: {
            options: {
              journeyName: 'mock-journey',
            },
          },
        }

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should render the timeout template', function () {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function () {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns missing prereq error', function () {
      let reqMock

      beforeEach(function () {
        errorMock.code = 'MISSING_PREREQ'
        reqMock = {
          baseUrl: '/journey-base-url-other',
          form: {
            options: {
              journeyName: 'mock-journey',
            },
          },
        }

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should render the timeout template', function () {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function () {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns missing location error', function () {
      let reqMock

      beforeEach(function () {
        errorMock.code = 'MISSING_LOCATION'
        reqMock = {
          baseUrl: '/journey-base-url-other',
          form: {
            options: {
              journeyName: 'mock-journey',
            },
          },
        }

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should render the timeout template', function () {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function () {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns a CSRF error', function () {
      let reqMock

      beforeEach(function () {
        errorMock.code = 'CSRF_ERROR'
        reqMock = {
          baseUrl: '/journey-base-url-other',
          form: {
            options: {
              journeyName: 'mock-journey',
            },
          },
        }

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should render the timeout template', function () {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function () {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns validation error', function () {
      let nextSpy

      beforeEach(function () {
        errorMock.statusCode = 422

        nextSpy = sinon.spy()
        sinon.spy(Sentry, 'withScope')
        sinon.stub(Sentry, 'captureException')

        controller.errorHandler(errorMock, {}, {}, nextSpy)
      })

      it('should call sentry with scope', function () {
        expect(Sentry.withScope).to.be.calledOnce
      })

      it('should send error to sentry', function () {
        expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
      })

      it('should call parent error handler', function () {
        expect(FormController.prototype.errorHandler).to.be.calledWith(
          errorMock,
          {},
          {},
          nextSpy
        )
      })
    })

    context('when any other errors are triggered', function () {
      let nextSpy

      beforeEach(function () {
        errorMock.code = 'OTHER_ERROR'
        nextSpy = sinon.spy()
      })

      it('should call parent error handler', function () {
        controller.errorHandler(errorMock, {}, {}, nextSpy)

        expect(FormController.prototype.errorHandler).to.be.calledWith(
          errorMock,
          {},
          {},
          nextSpy
        )
      })
    })
  })

  describe('#render()', function () {
    let reqMock, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      sinon.spy(FormController.prototype, 'render')
      sinon
        .stub(fieldHelpers, 'setFieldValue')
        .callsFake(() => ([key, field]) => {
          return [key, { ...field, setFieldValue: true }]
        })
      sinon
        .stub(fieldHelpers, 'setFieldError')
        .callsFake(() => ([key, field]) => {
          return [key, { ...field, setFieldError: true }]
        })
      sinon.stub(fieldHelpers, 'translateField').callsFake(([key, field]) => {
        return [key, { ...field, translateField: true }]
      })
      sinon
        .stub(fieldHelpers, 'renderConditionalFields')
        .callsFake(([key, field]) => {
          return [key, { ...field, renderConditionalFields: true }]
        })

      reqMock = {
        form: {
          options: {
            fields: {
              field_1: {
                name: 'Field 1',
              },
              field_2: {
                name: 'Field 2',
              },
              field_3: {
                name: 'Field 3',
              },
            },
          },
        },
      }

      controller.render(reqMock, {}, nextSpy)
    })

    it('should call renderConditionalFields on each field', function () {
      expect(fieldHelpers.renderConditionalFields).to.be.calledThrice
    })

    it('should call setFieldValue', function () {
      expect(fieldHelpers.setFieldValue).to.be.calledOnce
    })

    it('should call setFieldError', function () {
      expect(fieldHelpers.setFieldError).to.be.calledOnce
    })

    it('should call translateField', function () {
      expect(fieldHelpers.setFieldValue).to.be.calledOnce
    })

    it('should mutate fields object', function () {
      expect(reqMock.form.options.fields).to.deep.equal({
        field_1: {
          renderConditionalFields: true,
          setFieldValue: true,
          setFieldError: true,
          translateField: true,
          name: 'Field 1',
        },
        field_2: {
          renderConditionalFields: true,
          setFieldValue: true,
          setFieldError: true,
          translateField: true,
          name: 'Field 2',
        },
        field_3: {
          renderConditionalFields: true,
          setFieldValue: true,
          setFieldError: true,
          translateField: true,
          name: 'Field 3',
        },
      })
    })

    it('should call parent render method', function () {
      expect(FormController.prototype.render).to.be.calledOnceWithExactly(
        reqMock,
        {},
        nextSpy
      )
    })
  })
})
