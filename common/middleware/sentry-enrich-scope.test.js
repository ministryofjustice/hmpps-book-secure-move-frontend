const Sentry = require('@sentry/node')

const sentryEnrichScope = require('./sentry-enrich-scope')

describe('#sentryEnrichScope', function () {
  let req, res, nextSpy

  beforeEach(function () {
    sinon.stub(Sentry, 'setTag')
    sinon.stub(Sentry, 'setContext')
    sinon.stub(Sentry, 'setUser')
    nextSpy = sinon.spy()
    req = {
      session: {},
    }
    res = {}
  })

  context('without session', function () {
    beforeEach(function () {
      sentryEnrichScope(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not call Sentry', function () {
      expect(Sentry.setTag).not.to.be.called
      expect(Sentry.setContext).not.to.be.called
      expect(Sentry.setUser).not.to.be.called
    })
  })

  context('with user', function () {
    beforeEach(function () {
      req.user = {
        userId: 'user-1',
        username: 'jbloggs',
        permissions: ['move:view'],
      }
      sentryEnrichScope(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set user in Sentry', function () {
      expect(Sentry.setUser).to.be.calledOnceWithExactly({
        id: 'user-1',
        username: 'jbloggs',
        permissions: ['move:view'],
      })
    })
  })

  context('with location', function () {
    beforeEach(function () {
      req.session.currentLocation = {
        key: 'aaa001',
        location_type: 'police',
        title: 'Police station X',
      }
      sentryEnrichScope(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should set location tags in Sentry', function () {
      expect(Sentry.setTag).to.be.calledWithExactly('location.key', 'AAA001')
      expect(Sentry.setTag).to.be.calledWithExactly('location.type', 'police')
    })

    it('should set location context in Sentry', function () {
      expect(Sentry.setContext).to.be.calledOnceWithExactly('location', {
        name: 'Police station X',
        key: 'AAA001',
        location_type: 'police',
      })
    })
  })
})
