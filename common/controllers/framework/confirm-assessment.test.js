const proxyquire = require('proxyquire')

const FormWizardController = require('../form-wizard')

const setMoveSummary = sinon.stub()

const ConfirmAssessmentController = proxyquire('./confirm-assessment', {
  '../../middleware/set-move-summary': setMoveSummary,
})

const controller = new ConfirmAssessmentController({ route: '/' })

describe('Framework controllers', function () {
  describe('ConfirmAssessmentController', function () {
    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkStatus')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set move with summary', function () {
        expect(controller.use).to.have.been.calledWithExactly(setMoveSummary)
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

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

      context('with incomplete status', function () {
        beforeEach(function () {
          mockReq.assessment.status = 'incomplete'
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should redirect to move', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('with confirmed status', function () {
        beforeEach(function () {
          mockReq.assessment.status = 'confirmed'
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).to.not.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.called
        })
      })

      context(
        'with confirmed status and handover_occurred_at set',
        function () {
          beforeEach(function () {
            mockReq.assessment.status = 'confirmed'
            mockReq.assessment.handover_occurred_at = '123'
            controller.checkStatus(mockReq, mockRes, nextSpy)
          })

          it('should redirect to move', function () {
            expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
          })

          it('should not call next', function () {
            expect(nextSpy).not.to.be.called
          })
        }
      )
    })

    describe('#saveValues', function () {
      const mockPERId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          assessment: {
            id: mockPERId,
            framework: {
              name: 'person-escort-record',
            },
          },
          services: {
            personEscortRecord: {
              confirm: sinon.stub().resolves({}),
            },
            youthRiskAssessment: {
              confirm: sinon.stub().resolves({}),
            },
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should confirm person escort record', function () {
          expect(
            req.services.personEscortRecord.confirm
          ).to.be.calledOnceWithExactly(mockPERId)
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          req.services.personEscortRecord.confirm.throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
        })
      })

      context('with youth risk assessment', function () {
        beforeEach(async function () {
          req.assessment.framework.name = 'youth-risk-assessment'
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call the correct service method', function () {
          expect(
            req.services.youthRiskAssessment.confirm
          ).to.be.calledOnceWithExactly(req.assessment.id)
        })
      })
    })

    describe('#errorHandler', function () {
      let nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
      })

      context('when assessment is already confirmed', function () {
        const errorMock = new Error('Already confirmed')

        beforeEach(function () {
          errorMock.statusCode = 422
          errorMock.errors = [
            {
              code: 'invalid_status',
            },
          ]

          sinon.stub(controller, 'successHandler')
          sinon.stub(FormWizardController.prototype, 'errorHandler')
          controller.errorHandler(errorMock, {}, {}, nextSpy)
        })

        it('should not call parent error handler', function () {
          expect(FormWizardController.prototype.errorHandler).not.to.be.called
        })

        it('should call success handler', function () {
          expect(controller.successHandler).to.be.calledOnceWithExactly({}, {})
        })
      })

      context('with any other error', function () {
        const errorMock = new Error('Problem')

        beforeEach(function () {
          sinon.stub(FormWizardController.prototype, 'errorHandler')
          controller.errorHandler(errorMock, {}, {}, nextSpy)
        })

        it('should call parent error handler', function () {
          expect(
            FormWizardController.prototype.errorHandler
          ).to.be.calledOnceWithExactly(errorMock, {}, {}, nextSpy)
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
