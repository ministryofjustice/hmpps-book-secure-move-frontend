const Sentry = require('@sentry/node')
const FormController = require('hmpo-form-wizard').Controller
const { cloneDeep } = require('lodash')
const pathToRegexp = require('path-to-regexp')
const proxyquire = require('proxyquire')
const compileStub = sinon.stub(pathToRegexp, 'compile')
const toPathStub = sinon.stub()
compileStub.callsFake(str => {
  toPathStub.resetHistory()
  toPathStub.callsFake(() => str)
  return toPathStub
})

const Controller = proxyquire('./form-wizard', {
  'path-to-regexp': pathToRegexp,
})
const fieldHelpers = require('../helpers/field')

const controller = new Controller({ route: '/' })

describe('Form wizard', function() {
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
        errors = controller.getErrors(reqMock, {}) // ?
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
              html: 'fields::fieldOne.label validation::required',
            },
            {
              href: '#fieldTwo',
              html: 'fields::fieldTwo.label validation::required',
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

      it('redirect to specified value', function() {
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
          form: {
            options: {
              journeyName: 'mock-journey',
            },
          },
        }

        controller.errorHandler(errorMock, reqMock, resMock)
      })

      it('should render the timeout template', function() {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function() {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function() {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns missing prereq error', function() {
      let reqMock

      beforeEach(function() {
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

      it('should render the timeout template', function() {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function() {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
        })
      })

      it('should not call parent error handler', function() {
        expect(FormController.prototype.errorHandler).not.to.be.called
      })
    })

    context('when it returns missing prereq error', function() {
      let reqMock

      beforeEach(function() {
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

      it('should render the timeout template', function() {
        expect(resMock.render.args[0][0]).to.equal('form-wizard-error')
      })

      it('should pass the correct data to the view', function() {
        expect(resMock.render.args[0][1]).to.deep.equal({
          journeyBaseUrl: reqMock.baseUrl,
          errorKey: errorMock.code.toLowerCase(),
          journeyName: 'mock_journey',
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

  describe('#renderComponentHtmlToCheerio()', function() {
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

  describe('#getValues()', function() {
    let getValuesStub
    let callback
    let req
    let res

    beforeEach(function() {
      callback = sinon.spy()
      sinon.stub(controller, 'getUpdateValues').returns({ baz: 'tastic' })
      sinon.stub(controller, 'protectUpdateFields')
      getValuesStub = sinon.stub(FormController.prototype, 'getValues')
      getValuesStub.callsFake((req, res, valuesCallback) => {
        valuesCallback(null, { foo: 'bar' })
      })
      req = {
        form: {
          options: {},
        },
      }
      res = {
        locals: {},
      }
    })

    context('when req.form.options.update is not true', function() {
      it('should not call the getUpdateValues method', function() {
        controller.getValues(req, res, callback)
        expect(controller.getUpdateValues).to.not.be.called
      })

      it('should invoke the callback', function() {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(null, { foo: 'bar' })
      })
    })

    context('when req.form.options.update is true', function() {
      beforeEach(function() {
        req.form.options.update = true
      })
      it('should call the getUpdateValues method with the correct args', function() {
        controller.getValues(req, res, callback)
        expect(controller.getUpdateValues).to.be.calledOnceWithExactly(req, res)
      })
      it('should call the protectUpdateFields method with the correct args', function() {
        controller.getValues(req, res, callback)
        expect(controller.protectUpdateFields).to.be.calledOnceWithExactly(
          req,
          res,
          {
            foo: 'bar',
            baz: 'tastic',
          }
        )
      })

      it('should invoke the callback with the correct args', function() {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(null, {
          foo: 'bar',
          baz: 'tastic',
        })
      })
    })

    context('when super.getUpdateValues passes an error', function() {
      let err
      beforeEach(function() {
        err = new Error()
        getValuesStub.callsFake((req, res, valuesCallback) => {
          valuesCallback(err, { foo: 'bar' })
        })
      })

      it('should invoke the callback with the error', function() {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(err)
      })
    })

    context('when this.getUpdateValues throws an error', function() {
      let err
      beforeEach(function() {
        req.form.options.update = true
        err = new Error()
        controller.getUpdateValues.restore()
        sinon.stub(controller, 'getUpdateValues').throws(err)
      })

      it('should invoke the callback with the error', function() {
        controller.getValues(req, res, callback)
        expect(callback).to.be.calledOnceWithExactly(err)
      })
    })
  })

  describe('#getUpdateValues()', function() {
    context('when default getUpdateValues method invoked', function() {
      it('should return an empty object', function() {
        const values = controller.getUpdateValues({}, {})
        expect(values).to.deep.equal({})
      })
    })
  })

  describe('#protectUpdateFields()', function() {
    const unprotectedComponent = {
      component: 'a',
      prop: false,
      updateComponent: {
        component: 'b',
        prop: true,
        anotherProp: true,
      },
    }
    const protectedComponent = cloneDeep(unprotectedComponent)
    protectedComponent.updateProtect = true

    const fields = {
      unprotected: cloneDeep(unprotectedComponent),
      protectedUndef: cloneDeep(protectedComponent),
      protectedNull: cloneDeep(protectedComponent),
      protected: cloneDeep(protectedComponent),
    }
    let req
    const res = {}
    const values = {
      unprotected: 'unprotected-value',
      protectedNull: null,
      protected: 'protected-value',
    }
    beforeEach(function() {
      req = {
        form: {
          options: {
            fields: cloneDeep(fields),
          },
        },
      }
    })

    context('when step is not in update mode', function() {
      it('should leave fields unchanged', function() {
        controller.protectUpdateFields(req, res, values)
        expect(req.form.options.fields).to.deep.equal(fields)
      })
    })

    context('when step is in update mode', function() {
      beforeEach(function() {
        req.form.options.update = true
      })
      it('should leave unprotected fields unchanged', function() {
        controller.protectUpdateFields(req, res, values)
        const { unprotected } = req.form.options.fields
        expect(unprotected).to.deep.equal(fields.unprotected)
      })
      it('should leave protected fields that have no value unchanged', function() {
        controller.protectUpdateFields(req, res, values)
        const { protectedUndef } = req.form.options.fields
        expect(protectedUndef).to.deep.equal(fields.protectedUndef)
      })
      it('should leave protected fields that have null value unchanged', function() {
        controller.protectUpdateFields(req, res, values)
        const { protectedNull } = req.form.options.fields
        expect(protectedNull).to.deep.equal(fields.protectedNull)
      })
      it('should update component of protected fields that have a value', function() {
        controller.protectUpdateFields(req, res, values)
        const { protected: protectedField } = req.form.options.fields
        expect(protectedField.component).to.equal('b')
        expect(protectedField).to.have.property('prop', true)
        expect(protectedField).to.have.property('anotherProp', true)
      })
    })
  })

  describe('#successHandler()', function() {
    let successHandlerStub
    const req = {
      form: {
        options: {},
      },
      journeyModel: {},
      sessionModel: {},
    }
    const res = {
      locals: {},
    }
    let next

    beforeEach(function() {
      successHandlerStub = sinon.stub(
        FormController.prototype,
        'successHandler'
      )
      res.redirect = sinon.stub()
      req.journeyModel.reset = sinon.spy()
      req.sessionModel.reset = sinon.spy()
      next = sinon.spy()
    })

    context('when update is not true', function() {
      it('should invoke the parent successHandler method', function() {
        controller.successHandler(req, res, next)
        expect(successHandlerStub).to.be.calledOnceWithExactly(req, res, next)
      })
      it('should not redirect', function() {
        controller.successHandler(req, res, next)
        expect(res.redirect).to.not.be.called
      })
      it('should not reset the form models', function() {
        controller.successHandler(req, res, next)
        expect(req.journeyModel.reset).to.not.be.called
        expect(req.sessionModel.reset).to.not.be.called
      })
    })

    const noUpdateBackStepTest =
      'when update is true but no updateBackStep has been set'
    context(noUpdateBackStepTest, function() {
      beforeEach(function() {
        req.form.options.update = true
      })
      it('should invoke the parent successHandler method', function() {
        controller.successHandler(req, res, next)
        expect(successHandlerStub).to.be.calledOnceWithExactly(req, res, next)
      })
      it('should not redirect', function() {
        controller.successHandler(req, res, next)
        expect(res.redirect).to.not.be.called
      })
      it('should not reset the form models', function() {
        controller.successHandler(req, res, next)
        expect(req.journeyModel.reset).to.not.be.called
        expect(req.sessionModel.reset).to.not.be.called
      })
    })

    context('when updateBackStep has been set', function() {
      beforeEach(function() {
        req.form.options.update = true
        req.form.options.updateBackStep = '/somewhere'
        compileStub.resetHistory()
      })
      it('should not invoke the parent successHandler method', function() {
        controller.successHandler(req, res, next)
        expect(successHandlerStub).to.not.be.called
      })
      it('should not compile updateBackStep', function() {
        controller.successHandler(req, res, next)
        expect(compileStub).to.not.be.called
      })
      it('should redirect to back step', function() {
        controller.successHandler(req, res, next)
        expect(res.redirect).to.be.calledOnceWithExactly('/somewhere')
      })
      it('should reset the form models', function() {
        controller.successHandler(req, res, next)
        expect(req.journeyModel.reset).to.be.called
        expect(req.sessionModel.reset).to.be.called
      })
      context('when updateBackStep contains substitution', function() {
        beforeEach(function() {
          req.form.options.updateBackStep = '/somewhere/:foo'
          res.locals.foo = 'bar'
        })
        it('should compile updateBackStep', function() {
          controller.successHandler(req, res, next)
          expect(compileStub).to.be.calledOnceWithExactly('/somewhere/:foo')
        })

        it('should call toPath', function() {
          controller.successHandler(req, res, next)
          expect(toPathStub).to.be.calledOnceWithExactly(res.locals)
        })
        it('should redirect to back step', function() {
          controller.successHandler(req, res, next)
          expect(res.redirect).to.be.called
        })
        context('but substitution is missing', function() {
          let error
          beforeEach(function() {
            error = new Error()
            toPathStub.throws(error)
            try {
              controller.successHandler(req, res, next)
            } catch (err) {
              // carry on
            }
          })
          it('should not redirect to back step', function() {
            expect(res.redirect).to.not.be.called
          })
          it('should not call the successHandler', function() {
            expect(successHandlerStub).to.not.be.called
          })
          it('should call next with error', function() {
            expect(next).to.be.calledOnceWithExactly(error)
          })
        })
      })
    })

    describe('#getUpdateBackStepUrl()', function() {
      const req = {
        form: {
          options: {},
        },
      }
      const res = {
        locals: {},
      }
      beforeEach(function() {
        req.form.options.update = true
      })

      context('When no updateBackStep has been set', function() {
        it('should return undefined', function() {
          expect(controller.getUpdateBackStepUrl(req, res)).to.be.undefined
        })
      })

      context('When updateBackStep has been set', function() {
        beforeEach(function() {
          req.form.options.updateBackStep = '/foo'
        })
        it('should return updateBackStep', function() {
          expect(controller.getUpdateBackStepUrl(req, res)).to.equal('/foo')
        })

        context('and it contains a substitution param', function() {
          beforeEach(function() {
            req.form.options.updateBackStep = '/foo/:bar'
            res.locals.bar = 'baz'
            compileStub.resetHistory()
            compileStub.returns(toPathStub)
            toPathStub.resetHistory()
            toPathStub.returns('/foo/baz')
          })

          it('should compile the url', function() {
            controller.getUpdateBackStepUrl(req, res)
            expect(compileStub).to.be.calledOnceWithExactly('/foo/:bar')
          })

          it('should pass the correct data to the compiled function', function() {
            controller.getUpdateBackStepUrl(req, res)
            expect(toPathStub).to.be.calledOnceWithExactly(res.locals)
          })

          it('should return url with substitution', function() {
            expect(controller.getUpdateBackStepUrl(req, res)).to.equal(
              '/foo/baz'
            )
          })
        })
      })
    })
  })
})
