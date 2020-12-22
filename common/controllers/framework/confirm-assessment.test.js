const FormWizardController = require('../form-wizard')

const ConfirmAssessmentController = require('./confirm-assessment')

const controller = new ConfirmAssessmentController({ route: '/' })

describe('Framework controllers', function () {
  describe('ConfirmAssessmentController', function () {
    describe('#middlewareChecks', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkStatus')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkStatus middleware', function () {
        expect(controller.use).to.have.been.calledWith(controller.checkStatus)
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkStatus', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
          assessment: {
            id: '12345',
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('with completed status', function () {
        beforeEach(function () {
          mockReq.assessment.status = 'completed'
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      const statuses = ['incomplete', 'confirmed']
      statuses.forEach(status => {
        context(`with ${status} status`, function () {
          beforeEach(function () {
            mockReq.assessment.status = status
            controller.checkStatus(mockReq, mockRes, nextSpy)
          })

          it('should redirect to move', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })
        })
      })
    })

    describe('#successHandler', function () {
      const mockMoveId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, res

      beforeEach(function () {
        req = {
          move: {
            id: mockMoveId,
          },
          sessionModel: {
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }

        controller.successHandler(req, res)
      })

      it('should reset the journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnceWithExactly()
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnceWithExactly()
      })

      it('should redirect correctly', function () {
        expect(res.redirect).to.have.been.calledOnceWithExactly(
          `/move/${mockMoveId}`
        )
      })
    })
  })
})
