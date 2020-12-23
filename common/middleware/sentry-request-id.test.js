const Sentry = require('@sentry/node')

const sentryRequestId = require('./sentry-request-id')

describe('#sentryRequestId', function () {
  let req, res, nextSpy

  beforeEach(function () {
    sinon.stub(Sentry, 'setTag')
    nextSpy = sinon.spy()
    req = {
      get: sinon.stub(),
    }
    res = {}
  })

  context('without any ids', function () {
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

    it('should set transaction ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledOnceWithExactly(
        'transaction_id',
        '12345-aaaaa'
      )
    })
  })

  context('with request id', function () {
    beforeEach(function () {
      req.get.withArgs('x-request-id').returns('67890-bbbbb')
      sentryRequestId(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set request ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledOnceWithExactly(
        'request_id',
        '67890-bbbbb'
      )
    })
  })

  context('with both ids', function () {
    beforeEach(function () {
      req.transactionId = '12345-aaaaa'
      req.get.withArgs('x-request-id').returns('67890-bbbbb')
      sentryRequestId(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set request ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly('request_id', '67890-bbbbb')
    })

    it('should set transaction ID tag in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly(
        'transaction_id',
        '12345-aaaaa'
      )
    })

    it('should set correct number of tags', function () {
      expect(Sentry.setTag).to.be.calledTwice
    })
  })
})
