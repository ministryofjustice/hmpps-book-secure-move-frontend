const Controller = require('./allocation-details')
const ParentController = require('./base')
const controller = new Controller({
  route: '/',
})

describe('Allocation details controller', function() {
  describe('#middlewareSetup', function() {
    beforeEach(function() {
      sinon.stub(ParentController.prototype, 'middlewareSetup')
      sinon.stub(controller, 'use')
      controller.middlewareSetup()
    })

    it('calls the parent middleware setup', function() {
      expect(ParentController.prototype.middlewareSetup).to.have.been.calledOnce
    })
    it('sets in the chain of middleware setLocationItems for both fields', function() {
      expect(controller.use).to.have.been.calledTwice
    })
  })
})
