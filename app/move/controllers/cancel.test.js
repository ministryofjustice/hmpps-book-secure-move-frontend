const FormWizardController = require('../../../common/controllers/form-wizard')
const moveService = require('../../../common/services/move')

const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockMove = {
  id: '123456789',
  person: {
    fullname: 'Full name',
  },
}
const mockValues = {
  cancellation_reason: 'error',
  cancellation_reason_comment: 'Request was made in error',
}

describe('Move controllers', function() {
  describe('Cancel controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkAllocation')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkAllocation middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkAllocation
        )
      })

      it('should call correct number of middleware', function() {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkAllocation()', function() {
      let mockRes, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        mockRes = {
          locals: {
            move: {
              id: '12345',
            },
          },
          redirect: sinon.spy(),
        }
      })

      context('with non allocation move', function() {
        beforeEach(function() {
          controller.checkAllocation({}, mockRes, nextSpy)
        })

        it('should not redirect', function() {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with allocation move', function() {
        beforeEach(function() {
          mockRes.locals.move.allocation = {
            id: '123',
          }
          controller.checkAllocation({}, mockRes, nextSpy)
        })

        it('should redirect to move', function() {
          expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          form: {
            options: {
              allFields: {
                cancellation_reason: {},
                cancellation_reason_comment: {},
              },
            },
          },
          sessionModel: {
            reset: sinon.stub(),
            toJSON: () => mockValues,
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
          locals: {
            move: mockMove,
          },
        }
      })

      context('when move save is successful', function() {
        beforeEach(async function() {
          sinon.stub(moveService, 'cancel').resolves({})
          await controller.successHandler(req, res, nextSpy)
        })

        it('should cancel move', function() {
          expect(moveService.cancel).to.be.calledWith(mockMove.id, {
            reason: mockValues.cancellation_reason,
            comment: mockValues.cancellation_reason_comment,
          })
        })

        it('should reset the journey', function() {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function() {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith('/move/123456789')
        })
      })

      context('when save fails', function() {
        const errorMock = new Error('Problem')

        beforeEach(async function() {
          sinon.stub(moveService, 'cancel').throws(errorMock)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with the error', function() {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function() {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.have.been.called
        })
      })
    })
  })
})
