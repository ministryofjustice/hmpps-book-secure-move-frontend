const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./form')
const fieldHelpers = require('../../../common/helpers/field')

const controller = new Controller({ route: '/' })

describe('Moves controllers', function () {
  describe('Form', function () {
    describe('#getErrors()', function () {
      let errors

      beforeEach(function () {
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
        beforeEach(function () {
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

        it('should contain correct number of errors', function () {
          expect(errors.errorList.length).to.equal(2)
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
              type: 'required',
              url: '/step-url',
            },
            errorList: [
              {
                href: '#fieldOne',
                text: 'fields.fieldOne.label validation.required',
              },
              {
                href: '#fieldTwo',
                text: 'fields.fieldTwo.label validation.required',
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

        it('redirect to specificed value', function () {
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
          }

          controller.errorHandler(errorMock, reqMock, resMock)
        })

        it('should render the timeout template', function () {
          expect(resMock.render.args[0][0]).to.equal('form-wizard-timeout')
        })

        it('should pass the correct data to the view', function () {
          expect(resMock.render.args[0][1]).to.deep.equal({
            journeyBaseUrl: reqMock.baseUrl,
          })
        })

        it('should not call parent error handler', function () {
          expect(FormController.prototype.errorHandler).not.to.be.called
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

          expect(FormController.prototype.errorHandler).to.be.calledWith(errorMock, {}, {}, nextSpy)
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
            return [ key, { ...field, setFieldValue: true } ]
          })
        sinon
          .stub(fieldHelpers, 'setFieldError')
          .callsFake(() => ([key, field]) => {
            return [ key, { ...field, setFieldError: true } ]
          })
        sinon
          .stub(fieldHelpers, 'translateField')
          .callsFake(() => ([key, field]) => {
            return [ key, { ...field, translateField: true } ]
          })
        sinon
          .stub(fieldHelpers, 'renderConditionalFields')
          .callsFake(([key, field]) => {
            return [ key, { ...field, renderConditionalFields: true } ]
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
        expect(FormController.prototype.render).to.be.calledOnceWithExactly(reqMock, {}, nextSpy)
      })
    })
  })
})
