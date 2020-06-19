const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const moveService = require('../../../common/services/move')

const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockMove = {
  id: '123456789',
  profile: {
    person: {
      fullname: 'Full name',
    },
  },
}
const mockValues = {
  cancellation_reason: 'error',
  cancellation_reason_comment: 'Request was made in error',
}

describe('Move controllers', function () {
  describe('Cancel controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkAllocation')
        sinon.stub(controller, 'setAdditionalInfo')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkAllocation middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkAllocation
        )
      })

      it('should call checkAllocation middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.setAdditionalInfo
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('setAdditionalInfo', function () {
      let res
      let next
      beforeEach(function () {
        res = {
          locals: {
            move: { id: 123, profile: { person: { name: 'John Doe' } } },
          },
        }
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        next = sinon.stub()
        controller.setAdditionalInfo({}, res, next)
      })
      it('passes the move to moveToMetaListComponent', function () {
        expect(
          presenters.moveToMetaListComponent
        ).to.have.been.calledWithExactly({
          id: 123,
          profile: { person: { name: 'John Doe' } },
        })
      })
      it('sets moveSummary on the locals', function () {
        expect(res.locals.moveSummary).to.exist
        expect(res.locals.moveSummary).to.deep.equal({
          id: 123,
          profile: { person: { name: 'John Doe' } },
        })
      })
      it('sets person on the locals', function () {
        expect(res.locals.person).to.exist
        expect(res.locals.person).to.deep.equal({ name: 'John Doe' })
      })
      it('calls next', function () {
        expect(next).to.have.been.calledWithExactly()
      })
    })

    describe('#checkAllocation()', function () {
      let mockRes, nextSpy

      beforeEach(function () {
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

      context('with non allocation move', function () {
        beforeEach(function () {
          controller.checkAllocation({}, mockRes, nextSpy)
        })

        it('should not redirect', function () {
          expect(mockRes.redirect).not.to.be.called
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with allocation move', function () {
        beforeEach(function () {
          mockRes.locals.move.allocation = {
            id: '123',
          }
          controller.checkAllocation({}, mockRes, nextSpy)
        })

        it('should redirect to move', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly('/move/12345')
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    describe('#successHandler()', function () {
      let req, res, nextSpy

      beforeEach(function () {
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

      context('when move save is successful', function () {
        beforeEach(async function () {
          sinon.stub(moveService, 'cancel').resolves({})
          await controller.successHandler(req, res, nextSpy)
        })

        it('should cancel move', function () {
          expect(moveService.cancel).to.be.calledWith(mockMove.id, {
            reason: mockValues.cancellation_reason,
            comment: mockValues.cancellation_reason_comment,
          })
        })

        it('should reset the journey', function () {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function () {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function () {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith('/move/123456789')
        })
      })

      context('when save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          sinon.stub(moveService, 'cancel').throws(errorMock)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.have.been.called
        })
      })
    })
  })
})
