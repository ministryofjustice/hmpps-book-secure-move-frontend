const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')

const Controller = require('./remove-move')

const controller = new Controller({ route: '/' })

describe('Remove move controller', function () {
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
        move: {
          id: '12345',
        },
        allocation: {
          id: '56789',
        },
      }
      mockRes = {
        redirect: sinon.spy(),
      }
    })

    const notAllowedMoveStatuses = [
      'accepted',
      'in_transit',
      'completed',
      'cancelled',
    ]
    notAllowedMoveStatuses.forEach(status => {
      context(`with ${status} move status`, function () {
        beforeEach(function () {
          mockReq.move.status = status
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should redirect to allocation', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            '/allocation/56789'
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    const allowedMoveStatuses = ['proposed', 'requested', 'booked']
    allowedMoveStatuses.forEach(status => {
      context(`with ${status} move status`, function () {
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

    const notAllowedAllocationStatuses = ['cancelled']
    notAllowedAllocationStatuses.forEach(status => {
      context(`with ${status} allocation status`, function () {
        beforeEach(function () {
          mockReq.move.status = 'requested'
          mockReq.allocation.status = status
          controller.checkStatus(mockReq, mockRes, nextSpy)
        })

        it('should redirect to allocation', function () {
          expect(mockRes.redirect).to.be.calledOnceWithExactly(
            '/allocation/56789'
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })

    const allowedAllocationStatuses = ['filled', 'unfilled']
    allowedAllocationStatuses.forEach(status => {
      context(`with ${status} allocation status`, function () {
        beforeEach(function () {
          mockReq.move.status = 'requested'
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
})
