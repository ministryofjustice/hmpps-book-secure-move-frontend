const ensureCurrentLocation = require('./ensure-current-location')

const locationsMountpath = '/locations'

describe('Ensure current location middleware', function () {
  let req, res, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = {
      url: '/url',
      session: {},
    }
    res = {
      redirect: sinon.spy(),
    }
  })

  context('when current is a string', function () {
    beforeEach(function () {
      req.session.currentLocation = 'current-location'

      ensureCurrentLocation({
        locationsMountpath,
      })(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not redirect', function () {
      expect(res.redirect).not.to.be.called
    })
  })

  context('when current location is null', function () {
    beforeEach(function () {
      req.session.currentLocation = null

      ensureCurrentLocation({
        locationsMountpath,
      })(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not redirect', function () {
      expect(res.redirect).not.to.be.called
    })
  })

  context('when url is in the whitelist', function () {
    const whitelist = ['/url', '/bypass-url']

    beforeEach(function () {
      ensureCurrentLocation({
        locationsMountpath,
        whitelist,
      })(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not redirect', function () {
      expect(res.redirect).not.to.be.called
    })
  })

  context('when url contains locations mountpath', function () {
    beforeEach(function () {
      req.url = '/locations/location-id'

      ensureCurrentLocation({
        locationsMountpath,
      })(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not redirect', function () {
      expect(res.redirect).not.to.be.called
    })
  })

  context('when no bypass exists', function () {
    beforeEach(function () {
      ensureCurrentLocation({
        locationsMountpath,
      })(req, res, nextSpy)
    })

    it('should not call next', function () {
      expect(nextSpy).not.to.be.called
    })

    it('should redirect to locations mountpath', function () {
      expect(res.redirect).to.be.calledOnceWithExactly(locationsMountpath)
    })
  })
})
