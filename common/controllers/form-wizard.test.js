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
      sinon.stub(controller, 'setInitialValues')
      sinon.stub(controller, 'setupAddMultipleFields')
      sinon.stub(controller, 'setupConditionalFields')
      sinon.stub(controller, 'setFieldContext')

      controller.middlewareSetup()
    })

    it('should call parent method', function () {
      expect(FormController.prototype.middlewareSetup).to.have.been.calledOnce
    })

    it('should set initial values', function () {
      expect(controller.use.getCall(0)).to.have.been.calledWithExactly(
        controller.setInitialValues
      )
    })

    it('should setup add multiple fields', function () {
      expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
        controller.setupAddMultipleFields
      )
    })

    it('should setup conditional fields', function () {
      expect(controller.use.getCall(2)).to.have.been.calledWithExactly(
        controller.setupConditionalFields
      )
    })

    it('should set field context', function () {
      expect(controller.use.getCall(3)).to.have.been.calledWithExactly(
        controller.setFieldContext
      )
    })

    it('should call correct number of middleware', function () {
      expect(controller.use).to.be.callCount(4)
    })
  })

  describe('#setupConditionalFields()', function () {
    let mockReq, nextSpy, reduceStub

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
            fields: {
              fizz: {
                name: 'fizz',
              },
              buzz: {
                name: 'buzz',
              },
            },
          },
        },
      }
      reduceStub = sinon.stub().returns({
        dependentField: {
          name: 'dependent-field',
        },
      })
      sinon.stub(fieldHelpers, 'flattenConditionalFields').returnsArg(0)
      sinon.stub(fieldHelpers, 'reduceDependentFields').returns(reduceStub)

      controller.setupConditionalFields(mockReq, {}, nextSpy)
    })

    it('should call flattenConditionalFields map', function () {
      expect(fieldHelpers.flattenConditionalFields.callCount).to.equal(2)
    })

    it('should call reduceDependentFields reducer', function () {
      expect(fieldHelpers.reduceDependentFields).to.be.calledOnceWithExactly(
        mockReq.form.options.allFields
      )
      expect(reduceStub.callCount).to.equal(2)
    })

    it('should set fields correctly', function () {
      expect(mockReq.form.options.fields).to.deep.equal({
        fizz: {
          name: 'fizz',
        },
        buzz: {
          name: 'buzz',
        },
        dependentField: {
          name: 'dependent-field',
        },
      })
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setFieldContext()', function () {
    let mockReq, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {
        form: {
          options: {
            key: 'foo',
            fields: {
              fizz: {
                name: 'fizz',
              },
              buzz: {
                name: 'buzz',
              },
            },
          },
        },
      }

      controller.setFieldContext(mockReq, {}, nextSpy)
    })

    it('should set fields correctly', function () {
      expect(mockReq.form.options.fields).to.deep.equal({
        fizz: {
          name: 'fizz',
          context: 'foo',
        },
        buzz: {
          name: 'buzz',
          context: 'foo',
        },
      })
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#getErrors()', function () {
    let errors, reqMock

    beforeEach(function () {
      sinon
        .stub(fieldHelpers, 'getFieldErrorMessage')
        .callsFake(({ key, type }) => {
          return `${key}.${type}`
        })
      sinon.stub(FormController.prototype, 'getErrors')
      reqMock = {
        form: {
          options: {
            fields: {
              fieldOne: {
                id: 'field-one',
              },
              fieldTwo: {
                id: 'field-two',
              },
            },
          },
        },
        t: sinon.stub().returnsArg(0),
      }
    })

    context('when parent returns empty errors object', function () {
      beforeEach(function () {
        FormController.prototype.getErrors.returns({})
        errors = controller.getErrors(reqMock, {})
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
        errors = controller.getErrors(reqMock, {})
      })

      it('should contain correct number of errors', function () {
        expect(errors.errorList.length).to.equal(2)
      })

      it('should get error messages', function () {
        expect(fieldHelpers.getFieldErrorMessage).to.be.calledWithExactly({
          ...reqMock.form.options.fields.fieldOne,
          ...mockErrors.fieldOne,
        })
        expect(fieldHelpers.getFieldErrorMessage).to.be.calledWithExactly({
          ...reqMock.form.options.fields.fieldTwo,
          ...mockErrors.fieldTwo,
        })
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
              href: `#${reqMock.form.options.fields.fieldOne.id}`,
              html: `${mockErrors.fieldOne.key}.${mockErrors.fieldOne.type}`,
            },
            {
              href: `#${reqMock.form.options.fields.fieldTwo.id}`,
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
