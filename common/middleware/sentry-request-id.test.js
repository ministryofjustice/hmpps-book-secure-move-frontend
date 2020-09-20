const Sentry = require('@sentry/node')

const sentryRequestId = require('./sentry-request-id')

describe('#sentryRequestId', function () {
  let req, res, nextSpy

  beforeEach(function () {
    sinon.stub(Sentry, 'setTag')
    nextSpy = sinon.spy()
    req = {
      headers: {},
    }
    res = {}
  })

  context('without request header', function () {
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

  context('with request header', function () {
    beforeEach(function () {
      req.headers['x-request-id'] = '12345-aaaaa'
      sentryRequestId(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set location tags in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly('request_id', '12345-aaaaa')
    })
  })
})
