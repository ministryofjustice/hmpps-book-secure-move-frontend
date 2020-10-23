const proxyquire = require('proxyquire').noCallThru()

const uuid = {}

const setTransactionId = proxyquire('./set-transaction-id', {
  uuid,
})

describe('Middleware', function () {
  describe('#setTranasctionId', function () {
    let next
    let req
    beforeEach(function () {
      uuid.v4 = sinon.stub().returns('#uuid')
      next = sinon.spy()
      req = {
        get: sinon.stub(),
      }
    })

    context('When request has no request id', function () {
      beforeEach(function () {
        setTransactionId(req, {}, next)
      })

      it('should check the x-request-id header', function () {
        expect(req.get).to.be.calledOnceWithExactly('x-request-id')
      })

      it('should create an id for the request', function () {
        expect(uuid.v4).to.be.calledOnceWithExactly()
      })

      it('should set the transaction id on the request', function () {
        expect(req.transactionId).to.equal('#uuid')
      })
    })

    context('When request has an request id', function () {
      beforeEach(function () {
        req.get.returns('#xRequestId')
        setTransactionId(req, {}, next)
      })

      it('should check the x-request-id header', function () {
        expect(req.get).to.be.calledOnceWithExactly('x-request-id')
      })

      it('should not create an id for the request', function () {
        expect(uuid.v4).to.not.be.called
      })

      it('should set the transaction id on the request', function () {
        expect(req.transactionId).to.equal('#xRequestId')
      })
    })
  })
})
