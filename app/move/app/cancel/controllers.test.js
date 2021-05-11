const FormWizardController = require('../../../../common/controllers/form-wizard')
const presenters = require('../../../../common/presenters')

const { CancelController } = require('./controllers')

const controller = new CancelController({ route: '/' })
const mockMove = {
  id: '123456789',
  profile: {
    person: {
      _fullname: 'Full name',
    },
  },
}
const mockValues = {
  cancellation_reason: 'made_in_error',
}

describe('Move controllers', function () {
  describe('Cancel controller', function () {
    describe('#middlewareChecks()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkAllocation')
        sinon.stub(controller, 'checkStatus')

        controller.middlewareChecks()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call checkStatus middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.checkStatus
        )
      })

      it('should call checkAllocation middleware', function () {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.checkAllocation
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setAdditionalInfo')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call setAdditionalInfo middleware', function () {
        expect(controller.use.firstCall).to.have.been.calledWith(
          controller.setAdditionalInfo
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(1)
      })
    })

    describe('#checkStatus()', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      const notAllowedStatuses = [
        'accepted',
        'in_transit',
        'completed',
        'cancelled',
      ]
      notAllowedStatuses.forEach(status => {
        context(`with ${status} status`, function () {
          beforeEach(function () {
            mockReq.move.status = status
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

      const allowedStatuses = ['proposed', 'requested', 'booked']
      allowedStatuses.forEach(status => {
        context(`with ${status} status`, function () {
          beforeEach(function () {
            mockReq.move.status = status
            controller.checkStatus(mockReq, mockRes, nextSpy)
          })

          it('should not redirect', function () {
            expect(mockRes.redirect).not.to.be.called
          })

          it('should call next', function () {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })
      })
    })

    describe('setAdditionalInfo', function () {
      let req, res, next

      beforeEach(function () {
        req = {
          move: { id: 123, profile: { person: { name: 'John Doe' } } },
        }
        res = {
          locals: {},
        }
        sinon.stub(presenters, 'moveToMetaListComponent').returnsArg(0)
        next = sinon.stub()
        controller.setAdditionalInfo(req, res, next)
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
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          move: {
            id: '12345',
          },
        }
        mockRes = {
          redirect: sinon.spy(),
        }
      })

      context('with non allocation move', function () {
        beforeEach(function () {
          controller.checkAllocation(mockReq, mockRes, nextSpy)
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
          mockReq.move.allocation = {
            id: '123',
          }
          controller.checkAllocation(mockReq, mockRes, nextSpy)
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
      let req, res, nextSpy, moveService

      beforeEach(function () {
        nextSpy = sinon.spy()
        moveService = {
          cancel: sinon.stub().resolves({}),
        }
        req = {
          form: {
            options: {
              allFields: {
                cancellation_reason: {},
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
          move: mockMove,
          services: {
            move: moveService,
          },
        }
        res = {
          redirect: sinon.stub(),
        }
      })

      context('when move save is successful', function () {
        beforeEach(async function () {
          await controller.successHandler(req, res, nextSpy)
        })

        it('should cancel move', function () {
          expect(moveService.cancel).to.be.calledWithExactly(mockMove.id, {
            reason: mockValues.cancellation_reason,
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
          req.services.move.cancel = sinon.stub().throws(errorMock)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWithExactly(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.have.been.called
        })
      })

      context('with cancellation_reason "other"', function () {
        it('should cancel with a comment using field "other comment"', async function () {
          mockValues.cancellation_reason = 'other'
          mockValues.cancellation_reason_other_comment =
            'cancelled for other reason'
          req.form.options.allFields.cancellation_reason_other_comment = {}
          req.services.move.cancel = sinon.stub().resolves({})
          await controller.successHandler(req, res, nextSpy)

          expect(moveService.cancel).to.be.calledWithExactly(mockMove.id, {
            reason: mockValues.cancellation_reason,
            comment: mockValues.cancellation_reason_other_comment,
          })
        })
      })

      context('with cancellation_reason "cancelled by pmu"', function () {
        it('should cancel with a comment using field "pmu comment" if provided', async function () {
          mockValues.cancellation_reason = 'cancelled_by_pmu'
          mockValues.cancellation_reason_cancelled_by_pmu_comment =
            'cancelled by pmu comment'
          req.form.options.allFields.cancellation_reason_cancelled_by_pmu_comment =
            {}
          req.services.move.cancel = sinon.stub().resolves({})
          await controller.successHandler(req, res, nextSpy)

          expect(moveService.cancel).to.be.calledWithExactly(mockMove.id, {
            reason: mockValues.cancellation_reason,
            comment: mockValues.cancellation_reason_cancelled_by_pmu_comment,
          })
        })

        it('should cancel without a comment if "pmu comment" not provided', async function () {
          mockValues.cancellation_reason = 'cancelled_by_pmu'
          req.services.move.cancel = sinon.stub().resolves({})
          await controller.successHandler(req, res, nextSpy)

          expect(moveService.cancel).to.be.calledWithExactly(mockMove.id, {
            reason: mockValues.cancellation_reason,
          })
        })
      })
    })
  })
})
