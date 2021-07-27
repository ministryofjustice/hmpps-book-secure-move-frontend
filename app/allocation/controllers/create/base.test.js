const ParentController = require('../../../../common/controllers/form-wizard')

const Controller = require('./base')
const controller = new Controller({
  route: '/',
})

describe('Base controller for create allocation', function () {
  let next

  beforeEach(function () {
    sinon.stub(ParentController.prototype, 'middlewareLocals')
    next = sinon.stub()
  })

  describe('middlewareLocals', function () {
    const use = sinon.stub()
    const cancelUrlStub = sinon.stub()

    beforeEach(function () {
      controller.middlewareLocals.call({
        use,
        router: {},
        setCancelUrl: cancelUrlStub,
      })
    })

    afterEach(function () {
      use.resetHistory()
    })

    it('calls the parent middlewareLocals', function () {
      expect(ParentController.prototype.middlewareLocals).to.have.been
        .calledOnce
    })

    it('adds setCancelUrl to the middleware stack', function () {
      expect(use).to.have.been.calledOnceWith(cancelUrlStub)
    })
  })

  describe('setCancelUrl', function () {
    let locals

    beforeEach(function () {
      locals = {}
      controller.setCancelUrl({}, { locals }, next)
    })

    it('sets the cancelUrl on locals', function () {
      expect(locals).to.deep.equal({
        cancelUrl: '/allocations',
      })
    })

    it('calls next', function () {
      expect(next).to.have.been.calledOnce
    })
  })
})
