const FormWizardController = require('../../../common/controllers/form-wizard')

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
})
