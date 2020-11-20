const FormWizardController = require('../../../../common/controllers/form-wizard')
const personEscortRecordService = require('../../../../common/services/person-escort-record')

const { ConfirmPersonEscortRecordController } = require('./controllers')

const controller = new ConfirmPersonEscortRecordController({ route: '/' })

describe('Person Escort Record controllers', function () {
  describe('ConfirmPersonEscortRecordController', function () {
    describe('#middlewareLocals', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setMoveId')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setMoveId middleware', function () {
        expect(controller.use).to.have.been.calledWith(controller.setMoveId)
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

    describe('#setMoveId', function () {
      let req, res, next

      beforeEach(function () {
        next = sinon.stub()
        req = {}
        res = {
          locals: {},
        }
      })

      context('with move', function () {
        beforeEach(function () {
          req = {
            move: {
              id: '12345',
            },
          }

          controller.setMoveId(req, res, next)
        })

        it('should set moveId on locals', function () {
          expect(res.locals.moveId).to.equal('12345')
        })

        it('should call next without error', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })

      context('without move', function () {
        beforeEach(function () {
          controller.setMoveId(req, res, next)
        })

        it('should not set moveId on locals', function () {
          expect(res.locals.moveId).to.be.undefined
        })

        it('should call next without error', function () {
          expect(next).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#saveValues', function () {
      const mockPERId = 'c756d3fb-d5c0-4cf4-9416-6691a89570f2'
      let req, nextSpy

      beforeEach(function () {
        sinon.stub(personEscortRecordService, 'confirm')
        nextSpy = sinon.spy()
        req = {
          assessment: {
            id: mockPERId,
          },
        }
      })

      context('when save is successful', function () {
        beforeEach(async function () {
          personEscortRecordService.confirm.resolves({})
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should confirm person escort record', function () {
          expect(personEscortRecordService.confirm).to.be.calledOnceWithExactly(
            mockPERId
          )
        })

        it('should not throw an error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          personEscortRecordService.confirm.throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorMock)
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
