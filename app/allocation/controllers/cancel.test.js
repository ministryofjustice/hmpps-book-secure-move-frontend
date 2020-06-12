const allocationService = require('../../../common/services/allocation')

const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockAllocation = {
  id: '123',
}
describe('Cancel controller', function () {
  describe('#successHandler()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
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
            cancellation_reason_comment: 'Comment',
          }),
        },
        journeyModel: {
          reset: sinon.stub(),
        },
      }
      res = {
        redirect: sinon.stub(),
        locals: {
          allocation: mockAllocation,
        },
      }
    })

    context('happy path', function () {
      beforeEach(async function () {
        sinon.stub(allocationService, 'cancel').resolves({})
        await controller.successHandler(req, res, nextSpy)
      })

      it('should cancel the allocation', function () {
        expect(allocationService.cancel).to.have.been.calledWithExactly(
          mockAllocation.id,
          {
            cancellation_reason: 'other',
            cancellation_reason_comment: 'Comment',
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
        sinon.stub(allocationService, 'cancel').throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.be.calledWith(errorMock)
      })
    })
  })
})
