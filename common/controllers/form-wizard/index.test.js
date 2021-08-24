const Sentry = require('@sentry/node')
const FormController = require('hmpo-form-wizard').Controller
const proxyquire = require('proxyquire')

const fieldHelpers = require('../../helpers/field')

const mixins = ['csrf']

describe('Form wizard', function () {
  let controller, Controller

  beforeEach(function () {
    const mixinStubs = {}

    mixins.forEach(mixin => {
      mixinStubs['./mixins/' + mixin] = sinon.stub().returnsArg(0)
    })

    Controller = proxyquire('./index', mixinStubs)
    controller = new Controller({ route: '/' })
  })

  describe('#middlewareActions()', function () {
    beforeEach(function () {
      sinon.stub(FormController.prototype, 'middlewareActions')
      sinon.stub(controller, 'use')
      sinon.stub(controller, 'setReturnUrl')

      controller.middlewareActions()
    })

    it('should call parent method', function () {
      expect(FormController.prototype.middlewareActions).to.have.been.calledOnce
    })

    it('should set initial values', function () {
      expect(controller.use).to.have.been.calledWithExactly(
        controller.setReturnUrl
      )
    })

    it('should call correct number of middleware', function () {
      expect(controller.use).to.be.callCount(1)
    })
  })

  describe('#setReturnUrl()', function () {
    let req
    let nextSpy

    beforeEach(function () {
      req = {
        query: {},
        sessionModel: {
          set: sinon.stub(),
        },
      }
      nextSpy = sinon.stub()
    })

    context('with returnUrl query param', function () {
      beforeEach(function () {
        req.query.returnUrl =
          '/move/f4bb4e50-59ce-4cd4-ba57-99f543206c4c/person-escort-record'

        controller.setReturnUrl(req, {}, nextSpy)
      })

      it('shoud update the session model', function () {
        expect(req.sessionModel.set).to.be.calledOnceWithExactly(
          'returnUrl',
          '/move/f4bb4e50-59ce-4cd4-ba57-99f543206c4c/person-escort-record'
        )
      })

      it('shoud call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('without returnUrl query param', function () {
      beforeEach(function () {
        controller.setReturnUrl(req, {}, nextSpy)
      })

      it('shoud not update the session model', function () {
        expect(req.sessionModel.set).not.to.be.called
      })

      it('shoud call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#middlewareSetup()', function () {
    beforeEach(function () {
      sinon.stub(FormController.prototype, 'middlewareSetup')
      sinon.stub(controller, 'use')
      sinon.stub(controller, 'setInitialValues')
      sinon.stub(controller, 'setupAddMultipleFieldsValues')
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

    it('should setup handling of arbitrary multiple fields', function () {
      expect(controller.use.getCall(1)).to.have.been.calledWithExactly(
        controller.setupAddMultipleFieldsValues
      )
    })

    it('should setup add multiple fields', function () {
      expect(controller.use.getCall(2)).to.have.been.calledWithExactly(
        controller.setupAddMultipleFields
      )
    })

    it('should setup conditional fields', function () {
      expect(controller.use.getCall(3)).to.have.been.calledWithExactly(
        controller.setupConditionalFields
      )
    })

    it('should set field context', function () {
      expect(controller.use.getCall(4)).to.have.been.calledWithExactly(
        controller.setFieldContext
      )
    })

    it('should call correct number of middleware', function () {
      expect(controller.use).to.be.callCount(5)
    })
  })

  describe('#setupAddMultipleFieldsValues()', function () {
    let req
    let next
    beforeEach(function () {
      req = {
        form: {
          options: {
            fields: {
              foo: {
                component: 'appAddAnother',
              },
            },
          },
        },
        sessionModel: {
          toJSON: sinon.stub().returns({}),
          set: sinon.stub(),
        },
      }
      next = sinon.stub()
    })

    context('When called', function () {
      beforeEach(function () {
        controller.setupAddMultipleFieldsValues(req, {}, next)
      })
      it('shoud invoke the next method', function () {
        expect(next).to.be.calledOnceWithExactly()
      })

      it('shoud not update the session model', function () {
        expect(req.sessionModel.set).to.not.be.called
      })
    })

    context('When body contains values for component', function () {
      beforeEach(function () {
        req.body = {
          foo: [{ id: 1 }],
        }
        controller.setupAddMultipleFieldsValues(req, {}, next)
      })

      it('shoud update the session model', function () {
        expect(req.sessionModel.set).to.be.calledOnceWithExactly('foo', [
          { id: 1 },
        ])
      })
    })

    context(
      'When session model’s errorValues contains values for component',
      function () {
        beforeEach(function () {
          req.sessionModel.toJSON.returns({
            errorValues: { foo: [{ id: 1 }] },
          })
          controller.setupAddMultipleFieldsValues(req, {}, next)
        })

        it('shoud update the session model', function () {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly('foo', [
            { id: 1 },
          ])
        })
      }
    )

    context('When component is not of type appAddAnother', function () {
      beforeEach(function () {
        req.form.options.fields.foo.component = 'appAnotherComponent'
        req.body = {
          foo: [{ id: 1 }],
        }
        req.sessionModel.toJSON.returns({
          errorValues: { foo: [{ id: 1 }] },
        })
        controller.setupAddMultipleFieldsValues(req, {}, next)
      })

      it('shoud not update the session model', function () {
        expect(req.sessionModel.set).to.not.be.called
      })
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
      sinon.stub(fieldHelpers, 'addErrorListToErrors')
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
        fieldHelpers.addErrorListToErrors.returns({ errorList: [] })
        FormController.prototype.getErrors.returns({})
        errors = controller.getErrors(reqMock, {})
      })

      it('should add the summary error list to the errors', function () {
        expect(fieldHelpers.addErrorListToErrors).to.be.calledOnceWithExactly(
          {},
          reqMock.form.options.fields
        )
      })

      it('should return the transformed errors object', function () {
        expect(errors).to.deep.equal({
          errorList: [],
        })
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
        fieldHelpers.addErrorListToErrors.returns({
          ...mockErrors,
          errorList: ['a', 'b'],
        })
        FormController.prototype.getErrors.returns(mockErrors)
        errors = controller.getErrors(reqMock, {})
      })

      it('should add the summary error list to the errors', function () {
        expect(fieldHelpers.addErrorListToErrors).to.be.calledOnceWithExactly(
          mockErrors,
          reqMock.form.options.fields
        )
      })

      it('should return the transformed errors object', function () {
        expect(errors).to.deep.equal({
          ...mockErrors,
          errorList: ['a', 'b'],
        })
      })
    })
  })

  describe('#errorHandler()', function () {
    let errorMock, resMock, reqMock, nextSpy

    beforeEach(function () {
      const journeyGetStub = sinon.stub()
      journeyGetStub
        .withArgs('history')
        .returns([{ foo: 'bar' }, { fizz: 'buzz' }])
        .withArgs('lastVisited')
        .returns('/foo')
      nextSpy = sinon.spy()
      errorMock = new Error()
      resMock = {
        redirect: sinon.spy(),
        render: sinon.spy(),
      }
      reqMock = {
        journeyModel: {
          get: journeyGetStub,
        },
        baseUrl: '/journey-base-url',
        form: {
          options: {
            journeyName: 'mock-journey-a369bd4e-09da-40fc-bd26-f41c0d695557',
            steps: {
              '/': {},
              '/step-one': {},
              '/last-step': {},
            },
          },
        },
      }
      sinon.stub(Sentry, 'captureException')
      sinon.stub(Sentry, 'setContext')
      sinon.spy(FormController.prototype, 'errorHandler')
      sinon.stub(FormController.prototype, 'getNextStep')
    })

    it('should send journey data to sentry', function () {
      controller.errorHandler(errorMock, reqMock, resMock, nextSpy)

      expect(Sentry.setContext).to.be.calledWithExactly('Journey', {
        'Original name': 'mock-journey-a369bd4e-09da-40fc-bd26-f41c0d695557',
        'Normalised name': 'mock_journey',
        history: '[{"foo":"bar"},{"fizz":"buzz"}]',
        lastVisited: '/foo',
      })
    })

    context('when a redirect property is set', function () {
      beforeEach(function () {
        errorMock.code = 'MISSING_PREREQ'
        errorMock.redirect = '/error-redirect-path/'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('redirect to specified value', function () {
        expect(resMock.redirect).to.be.calledWith(errorMock.redirect)
      })

      it('should not call parent error handler', function () {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns session timeout error', function () {
      beforeEach(function () {
        errorMock.code = 'SESSION_TIMEOUT'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should not send error to sentry', function () {
        expect(Sentry.captureException).not.to.be.called
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
      let mockScope

      beforeEach(function () {
        mockScope = {
          setLevel: sinon.stub(),
        }
        sinon.stub(Sentry, 'withScope')
        errorMock.code = 'MISSING_PREREQ'
      })

      context('without history', function () {
        beforeEach(function () {
          reqMock.journeyModel.get.withArgs('history').returns()
        })

        context('when step is the last step', function () {
          beforeEach(function () {
            FormController.prototype.getNextStep.returns('/last-step')

            controller.errorHandler(errorMock, reqMock, resMock)
          })

          it('should redirect to base URL', function () {
            expect(resMock.redirect).to.be.calledOnceWithExactly(
              '/journey-base-url'
            )
          })

          it('should not call sentry with scope', function () {
            expect(Sentry.withScope).not.to.be.called
          })

          it('should not render template', function () {
            expect(resMock.render).not.to.be.called
          })

          it('should not call parent error handler', function () {
            expect(FormController.prototype.errorHandler).not.to.be.called
          })
        })

        context('when step is not the last step', function () {
          beforeEach(function () {
            FormController.prototype.getNextStep.returns('/')

            controller.errorHandler(errorMock, reqMock, resMock)

            // run callback with mock scope
            Sentry.withScope.args[0][0](mockScope)
          })

          it('should call sentry with scope', function () {
            expect(Sentry.withScope).to.be.calledOnce
          })

          it('should send warning to sentry', function () {
            expect(mockScope.setLevel).to.be.calledOnceWithExactly('warning')
            expect(Sentry.captureException).to.be.calledOnceWithExactly(
              errorMock
            )
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
      })

      context('with history', function () {
        beforeEach(function () {
          reqMock.journeyModel.get.withArgs('history').returns(['one', 'two'])

          controller.errorHandler(errorMock, reqMock, resMock)

          // run callback with mock scope
          Sentry.withScope.args[0][0](mockScope)
        })

        it('should call sentry with scope', function () {
          expect(Sentry.withScope).to.be.calledOnce
        })

        it('should send warning to sentry', function () {
          expect(mockScope.setLevel).to.be.calledOnceWithExactly('warning')
          expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
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
    })

    context('when it returns missing location error', function () {
      beforeEach(function () {
        errorMock.code = 'MISSING_LOCATION'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should not send error to sentry', function () {
        expect(Sentry.captureException).not.to.be.called
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

    context('when it returns disabled location error', function () {
      beforeEach(function () {
        errorMock.code = 'DISABLED_LOCATION'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should not send error to sentry', function () {
        expect(Sentry.captureException).not.to.be.called
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
      beforeEach(function () {
        errorMock.code = 'CSRF_ERROR'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should send error to sentry', function () {
        expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
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

    context('when it returns a csurf CSRF error', function () {
      beforeEach(function () {
        errorMock.code = 'EBADCSRFTOKEN'

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should send error to sentry', function () {
        expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
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
      let nextSpy, mockScope

      beforeEach(function () {
        errorMock.statusCode = 422
        mockScope = {
          setContext: sinon.stub(),
        }

        nextSpy = sinon.spy()
        sinon.stub(Sentry, 'withScope')
      })

      context('with extra errors property', function () {
        beforeEach(function () {
          errorMock.errors = [
            {
              key: 'error-one',
              title: 'This is the first error',
            },
            {
              key: 'error-two',
              title: 'This is the second error',
            },
          ]

          controller.errorHandler(errorMock, reqMock, {}, nextSpy)

          // run callback with mock scope
          Sentry.withScope.args[0][0](mockScope)
        })

        it('should call sentry with scope', function () {
          expect(Sentry.withScope).to.be.calledOnce
        })

        it('should send error to sentry', function () {
          expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
        })

        it('should send contexts to sentry', function () {
          const { title: title0, ...error0 } = errorMock.errors[0]
          const { title: title1, ...error1 } = errorMock.errors[1]

          expect(mockScope.setContext).to.be.calledThrice
          expect(mockScope.setContext.getCall(0)).to.be.calledWithExactly(
            'Error 1',
            {
              ...error0,
              error_title: errorMock.errors[0].title,
            }
          )
          expect(mockScope.setContext.getCall(1)).to.be.calledWithExactly(
            'Error 2',
            {
              ...error1,
              error_title: errorMock.errors[1].title,
            }
          )
        })

        it('should send extra data as JSON to sentry', function () {
          expect(mockScope.setContext).to.be.calledWithExactly('Errors', {
            json: JSON.stringify(errorMock.errors),
          })
        })

        it('should call parent error handler', function () {
          expect(FormController.prototype.errorHandler).to.be.calledWith(
            errorMock,
            reqMock,
            {},
            nextSpy
          )
        })
      })

      context('without extra errors property', function () {
        beforeEach(function () {
          controller.errorHandler(errorMock, reqMock, {}, nextSpy)

          // run callback with mock scope
          Sentry.withScope.args[0][0](mockScope)
        })

        it('should call sentry with scope', function () {
          expect(Sentry.withScope).to.be.calledOnce
        })

        it('should send error to sentry', function () {
          expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
        })

        it('should not send contexts to sentry', function () {
          expect(mockScope.setContext).not.to.be.called
        })

        it('should call parent error handler', function () {
          expect(FormController.prototype.errorHandler).to.be.calledWith(
            errorMock,
            reqMock,
            {},
            nextSpy
          )
        })
      })
    })

    context('when any other errors are triggered', function () {
      let nextSpy

      beforeEach(function () {
        reqMock.journeyModel = undefined
        reqMock.form = undefined
        errorMock.code = 'OTHER_ERROR'
        nextSpy = sinon.spy()
      })

      it('should call parent error handler', function () {
        controller.errorHandler(errorMock, reqMock, {}, nextSpy)

        expect(FormController.prototype.errorHandler).to.be.calledWith(
          errorMock,
          reqMock,
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

  describe('mixins', function () {
    mixins.forEach(mixin => {
      it('should should run the ' + mixin + ' mixin function', function () {
        const mixinFunction = sinon.stub().returnsArg(0)
        proxyquire('./index', {
          ['./mixins/' + mixin]: mixinFunction,
        })

        expect(mixinFunction).to.have.been.calledOnceWithExactly(
          sinon.match.func
        )
      })
    })

    mixins.slice(1).forEach((mixin, index) => {
      const previousMixin = mixins[index]
      it(
        'should should run the ' +
          mixin +
          ' mixin function after ' +
          previousMixin,
        function () {
          const mixinFunction = sinon.stub().returnsArg(0)
          const previousMixinFunction = sinon.stub().returnsArg(0)

          proxyquire('./index', {
            ['./mixins/' + mixin]: mixinFunction,
            ['./mixins/' + previousMixin]: previousMixinFunction,
          })

          expect(mixinFunction).to.have.been.calledAfter(previousMixinFunction)
        }
      )
    })
  })
})
