const FormController = require('hmpo-form-wizard').Controller

const Controller = require('./form')

const controller = new Controller({ route: '/' })

describe('Moves controllers', function () {
  describe('Form', function () {
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
  })
})
