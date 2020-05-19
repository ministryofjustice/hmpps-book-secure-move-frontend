const ParentController = require('../../../common/controllers/form-wizard')
const allocationService = require('../../../common/services/allocation')

const CancelController = require('./cancel')

const controller = new CancelController({ route: '/' })
const mockAllocation = {
  id: '123',
}
describe('Cancel controller', function() {
  describe('middlewareLocals', function() {
    const use = sinon.stub()
    const cancelUrlStub = sinon.stub()
    beforeEach(function() {
      sinon.stub(ParentController.prototype, 'middlewareLocals')
      controller.middlewareLocals.call({
        use,
        router: {},
        setCancelUrl: cancelUrlStub,
      })
    })
    afterEach(function() {
      use.resetHistory()
    })
    it('calls the parent middlewareLocals', function() {
      expect(ParentController.prototype.middlewareLocals).to.have.been
        .calledOnce
    })
    it('adds setCancelUrl to the middleware stack', function() {
      expect(use).to.have.been.calledOnceWith(cancelUrlStub)
    })
  })
  describe('setCancelUrl', function() {
    let locals
    const next = sinon.stub()
    beforeEach(function() {
      locals = {
        allocation: {
          id: '123',
        },
      }
      next.resetHistory()
      controller.setCancelUrl({}, { locals }, next)
    })
    it('sets the cancelUrl on locals', function() {
      expect(locals).to.deep.equal({
        allocation: {
          id: '123',
        },
        cancelUrl: '/allocation/123',
      })
    })
    it('calls next', function() {
      expect(next).to.have.been.calledOnce
    })
  })
  describe('#successHandler()', function() {
    let req, res, nextSpy

    beforeEach(function() {
      nextSpy = sinon.spy()
      req = {
        form: {
          options: {
            allFields: {},
          },
        },
        sessionModel: {
          reset: sinon.stub(),
          toJSON: () => {},
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

    context('happy path', function() {
      beforeEach(async function() {
        sinon.stub(allocationService, 'cancel').resolves({})
        await controller.successHandler(req, res, nextSpy)
      })

      it('should cancel the allocation', function() {
        expect(allocationService.cancel).to.be.calledWithExactly(
          mockAllocation.id
        )
      })

      it('should reset the journey', function() {
        expect(req.journeyModel.reset).to.have.been.calledOnce
      })

      it('should reset the session', function() {
        expect(req.sessionModel.reset).to.have.been.calledOnce
      })

      it('should redirect correctly', function() {
        expect(res.redirect).to.have.been.calledOnce
        expect(res.redirect).to.have.been.calledWith('/allocation/123')
      })
    })

    context('unhappy path', function() {
      const errorMock = new Error('500!')

      beforeEach(async function() {
        sinon.stub(allocationService, 'cancel').throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function() {
        expect(nextSpy).to.be.calledWith(errorMock)
      })
    })
  })
})
