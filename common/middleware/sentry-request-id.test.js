const Sentry = require('@sentry/node')

const sentryRequestId = require('./sentry-request-id')

describe('#sentryRequestId', function () {
  let req, res, nextSpy

  beforeEach(function () {
    sinon.stub(Sentry, 'setTag')
    nextSpy = sinon.spy()
    req = {}
    res = {}
  })

  context('without transaction id', function () {
    beforeEach(function () {
      sentryRequestId(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not call Sentry', function () {
      expect(Sentry.setTag).not.to.be.called
    })
  })

  context('with transaction id', function () {
    beforeEach(function () {
      req.transactionId = '12345-aaaaa'
      sentryRequestId(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set request ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly('request_id', '12345-aaaaa')
    })

    it('should set transaction ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly(
        'transaction_id',
        '12345-aaaaa'
      )
    })
  })
})
