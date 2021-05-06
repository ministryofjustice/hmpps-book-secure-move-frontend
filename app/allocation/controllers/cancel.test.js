const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockAllocation = {
  id: '123',
}
describe('Cancel controller', function () {
  describe('#middlewareChecks()', function () {
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
      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.checkStatus
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
        allocation: {
          id: '12345',
        },
      }
      mockRes = {
        redirect: sinon.spy(),
      }
    })

    const notAllowedStatuses = ['cancelled']
    notAllowedStatuses.forEach(status => {
      context(`with ${status} status`, function () {
        beforeEach(function () {
          mockReq.allocation.status = status
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should redirect to allocation', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            '/allocation/12345'
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    const allowedStatuses = ['filled', 'unfilled']
    allowedStatuses.forEach(status => {
      context(`with ${status} status`, function () {
        beforeEach(function () {
          mockReq.allocation.status = status
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

  describe('#middlewareLocals()', function () {
    beforeEach(function () {
      sinon.stub(FormWizardController.prototype, 'middlewareLocals')
      sinon.stub(controller, 'use')
      sinon.stub(controller, 'setAdditionalLocals')

      controller.middlewareLocals()
    })

    it('should call parent method', function () {
      expect(FormWizardController.prototype.middlewareLocals).to.have.been
        .calledOnce
    })

    it('should call setAdditionalLocals middleware', function () {
      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.setAdditionalLocals
      )
    })

    it('should call correct number of middleware', function () {
      expect(controller.use.callCount).to.equal(1)
    })
  })

  describe('#setAdditionalLocals', function () {
    let req, res, next

    beforeEach(function () {
      req = {
        allocation: { id: 123, status: 'unfilled' },
      }
      res = {
        locals: {},
      }
      sinon
        .stub(presenters, 'allocationToMetaListComponent')
        .returns({ ...req.allocation, transformed: true })
      next = sinon.stub()
      controller.setAdditionalLocals(req, res, next)
    })

    it('sets allocation on the locals', function () {
      expect(res.locals.allocation).to.exist
      expect(res.locals.allocation).to.deep.equal({
        id: 123,
        status: 'unfilled',
      })
    })

    it('passes the move to allocationToMetaListComponent', function () {
      expect(
        presenters.allocationToMetaListComponent
      ).to.have.been.calledWithExactly({ id: 123, status: 'unfilled' })
    })

    it('sets moveSummary on the locals', function () {
      expect(res.locals.summary).to.exist
      expect(res.locals.summary).to.deep.equal({
        id: 123,
        status: 'unfilled',
        transformed: true,
      })
    })

    it('calls next', function () {
      expect(next).to.have.been.calledWithExactly()
    })
  })

  describe('#successHandler()', function () {
    let req, res, nextSpy, allocationService

    beforeEach(function () {
      nextSpy = sinon.spy()
      allocationService = {
        cancel: sinon.stub().resolves({}),
      }
      req = {
        form: {
          options: {
            allFields: {},
          },
        },
        sessionModel: {
          reset: sinon.stub(),
          toJSON: () => ({
            'csrf-secret': '123',
            errors: {},
            errorValues: {},
            cancellation_reason: 'other',
            cancellation_reason_other_comment: 'Comment',
          }),
        },
        journeyModel: {
          reset: sinon.stub(),
        },
        allocation: mockAllocation,
        services: {
          allocation: allocationService,
        },
      }
      res = {
        redirect: sinon.stub(),
      }
    })

    context('happy path', function () {
      beforeEach(async function () {
        await controller.successHandler(req, res, nextSpy)
      })

      it('should cancel the allocation', function () {
        expect(allocationService.cancel).to.have.been.calledWithExactly(
          mockAllocation.id,
          {
            reason: 'other',
            comment: 'Comment',
          }
        )
      })

      it('should reset the journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnce
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnce
      })

      it('should redirect correctly', function () {
        expect(res.redirect).to.have.been.calledOnce
        expect(res.redirect).to.have.been.calledWith('/allocation/123')
      })
    })
    context('unhappy path', function () {
      const errorMock = new Error('500!')

      beforeEach(async function () {
        req.services.allocation.cancel = sinon.stub().throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.be.calledWith(errorMock)
      })
    })
  })
})
