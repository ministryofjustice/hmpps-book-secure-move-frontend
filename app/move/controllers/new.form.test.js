const FormController = require('hmpo-form-wizard').Controller
const Sentry = require('@sentry/node')

const Controller = require('./new.form')
const fieldHelpers = require('../../../common/helpers/field')

const controller = new Controller({ route: '/' })

describe('Move controllers', function() {
  describe('Form', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call check current location method', function() {
        expect(controller.use).to.have.been.calledWith(
          controller.checkCurrentLocation
        )
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set cancel url method', function() {
        expect(controller.use).to.have.been.calledWith(controller.setCancelUrl)
      })
    })

    describe('#setCancelUrl()', function() {
      let res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        res = {
          locals: {},
        }
      })

      context('with no moves url local', function() {
        beforeEach(function() {
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url correctly', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.be.undefined
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with moves url local', function() {
        beforeEach(function() {
          res.locals.MOVES_URL = '/moves?move-date=2019-10-10'
          controller.setCancelUrl({}, res, nextSpy)
        })

        it('should set cancel url moves url', function() {
          expect(res.locals).to.have.property('cancelUrl')
          expect(res.locals.cancelUrl).to.equal('/moves?move-date=2019-10-10')
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#checkCurrentLocation()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          session: {},
        }
      })

      context('when current location exists', function() {
        beforeEach(function() {
          req.session = {
            currentLocation: {},
          }
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next without error', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when no current location exists', function() {
        beforeEach(function() {
          controller.checkCurrentLocation(req, {}, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0] instanceof Error).to.be.true
          expect(nextSpy.args[0][0].message).to.equal(
            'Current location is not set in session.'
          )
        })
      })
    })

    describe('#getErrors()', function() {
      let errors

      beforeEach(function() {
        sinon.stub(FormController.prototype, 'getErrors')
      })

      context('when parent returns empty errors object', function() {
        beforeEach(function() {
          FormController.prototype.getErrors.returns({})
          errors = controller.getErrors({}, {})
        })

        it('should set an empty error list property', function() {
          expect(errors.errorList.length).to.equal(0)
        })
      })

      context('when parent returns an errors object', function() {
        beforeEach(function() {
          FormController.prototype.getErrors.returns({
            fieldOne: {
              key: 'fieldOne',
              type: 'required',
              url: '/step-url',
            },
            fieldTwo: {
              key: 'fieldTwo',
              type: 'required',
              url: '/step-url',
            },
          })
          const reqMock = {
            t: sinon.stub().returnsArg(0),
          }
          errors = controller.getErrors(reqMock, {})
        })

        it('should contain correct number of errors', function() {
          expect(errors.errorList.length).to.equal(2)
        })

        it('should transform and append messages property', function() {
          expect(errors).to.deep.equal({
            fieldOne: {
              key: 'fieldOne',
              type: 'required',
              url: '/step-url',
            },
            fieldTwo: {
              key: 'fieldTwo',
              type: 'required',
              url: '/step-url',
            },
            errorList: [
              {
                href: '#fieldOne',
                text: 'fields::fieldOne.label validation::required',
              },
              {
                href: '#fieldTwo',
                text: 'fields::fieldTwo.label validation::required',
              },
            ],
          })
        })
      })
    })

    describe('#errorHandler()', function() {
      let errorMock, resMock

      beforeEach(function() {
        errorMock = new Error()
        resMock = {
          redirect: sinon.spy(),
          render: sinon.spy(),
        }
        sinon.spy(FormController.prototype, 'errorHandler')
      })

      context('when a redirect property is set', function() {
        beforeEach(function() {
          errorMock.code = 'MISSING_PREREQ'
          errorMock.redirect = '/error-redirect-path/'

          controller.errorHandler(errorMock, {}, resMock)
        })

        it('redirect to specificed value', function() {
          expect(resMock.redirect).to.be.calledWith(errorMock.redirect)
        })

        it('should not call parent error handler', function() {
          expect(FormController.prototype.errorHandler).not.to.be.called
        })
      })

      context('when it returns session timeout error', function() {
        let reqMock

        beforeEach(function() {
          errorMock.code = 'SESSION_TIMEOUT'
          reqMock = {
            baseUrl: '/journey-base-url',
          }

          controller.errorHandler(errorMock, reqMock, resMock)
        })

        it('should render the timeout template', function() {
          expect(resMock.render.args[0][0]).to.equal('form-wizard-timeout')
        })

        it('should pass the correct data to the view', function() {
          expect(resMock.render.args[0][1]).to.deep.equal({
            journeyBaseUrl: reqMock.baseUrl,
          })
        })

        it('should not call parent error handler', function() {
          expect(FormController.prototype.errorHandler).not.to.be.called
        })
      })

      context('when it returns validation error', function() {
        let nextSpy

        beforeEach(function() {
          errorMock.statusCode = 422

          nextSpy = sinon.spy()
          sinon.spy(Sentry, 'withScope')
          sinon.stub(Sentry, 'captureException')

          controller.errorHandler(errorMock, {}, {}, nextSpy)
        })

        it('should call sentry with scope', function() {
          expect(Sentry.withScope).to.be.calledOnce
        })

        it('should send error to sentry', function() {
          expect(Sentry.captureException).to.be.calledOnceWithExactly(errorMock)
        })

        it('should call parent error handler', function() {
          expect(FormController.prototype.errorHandler).to.be.calledWith(
            errorMock,
            {},
            {},
            nextSpy
          )
        })
      })

      context('when any other errors are triggered', function() {
        let nextSpy

        beforeEach(function() {
          errorMock.code = 'OTHER_ERROR'
          nextSpy = sinon.spy()
        })

        it('should call parent error handler', function() {
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

    describe('#render()', function() {
      let reqMock, nextSpy

      beforeEach(function() {
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
        sinon
          .stub(fieldHelpers, 'translateField')
          .callsFake(() => ([key, field]) => {
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

      it('should call renderConditionalFields on each field', function() {
        expect(fieldHelpers.renderConditionalFields).to.be.calledThrice
      })

      it('should call setFieldValue', function() {
        expect(fieldHelpers.setFieldValue).to.be.calledOnce
      })

      it('should call setFieldError', function() {
        expect(fieldHelpers.setFieldError).to.be.calledOnce
      })

      it('should call translateField', function() {
        expect(fieldHelpers.setFieldValue).to.be.calledOnce
      })

      it('should mutate fields object', function() {
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

      it('should call parent render method', function() {
        expect(FormController.prototype.render).to.be.calledOnceWithExactly(
          reqMock,
          {},
          nextSpy
        )
      })
    })
  })
})
