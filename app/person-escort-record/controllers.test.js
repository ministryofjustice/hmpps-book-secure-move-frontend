const FormWizardController = require('../../common/controllers/form-wizard')

const controllers = require('./controllers')

describe('Person Escort Record controllers', function () {
  describe('FrameworksController', function () {
    const controller = new controllers.FrameworksController({ route: '/' })

    describe('#successHandler', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        mockReq = {
          body: {},
          baseUrl: '/base-url',
        }
        mockRes = {
          redirect: sinon.stub(),
        }
        nextSpy = sinon.stub()

        sinon.stub(FormWizardController.prototype, 'successHandler')
      })

      context('with save and return submission', function () {
        beforeEach(function () {
          mockReq.body = {
            save_and_return_to_overview: '1',
          }
          controller.successHandler(mockReq, mockRes, nextSpy)
        })

        it('should redirect to base URL', function () {
          expect(mockRes.redirect).to.have.been.calledOnceWithExactly(
            '/base-url'
          )
        })

        it('should not call parent success handler', function () {
          expect(
            FormWizardController.prototype.successHandler
          ).not.to.have.been.called
        })
      })

      context('with standard submission', function () {
        beforeEach(function () {
          controller.successHandler(mockReq, mockRes, nextSpy)
        })

        it('should not redirect to base URL', function () {
          expect(mockRes.redirect).not.to.have.been.called
        })

        it('should call parent success handler', function () {
          expect(
            FormWizardController.prototype.successHandler
          ).to.have.been.calledOnce
        })
      })
    })
  })
})
