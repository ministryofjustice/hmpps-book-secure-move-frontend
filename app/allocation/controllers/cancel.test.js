const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockAllocation = {
  id: '123',
}
describe('Cancel controller', function () {
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
