const currentLocation = require('./set-current-location')

const mockLocation = {
  id: 'ce337679-1741-4ced-b592-fab7b5c0d388',
  key: 'hmirc_dover',
  title: 'HMIRC Dover',
}

describe('Current location middleware', function () {
  let req, nextSpy

  beforeEach(function () {
    nextSpy = sinon.spy()
    req = { session: {} }
  })

  context('when location already exists in session', function () {
    beforeEach(function () {
      req.session.currentLocation = 'location-value'
      currentLocation(req, {}, nextSpy)
    })

    it('should not mutate value on session', function () {
      expect(req.session.currentLocation).to.equal('location-value')
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  context("when location doesn't exist in session", function () {
    context('when user has no locations', function () {
      beforeEach(function () {
        currentLocation(req, {}, nextSpy)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when user has empty set of locations', function () {
      beforeEach(function () {
        req.session.user = {
          locations: [],
        }
        currentLocation(req, {}, nextSpy)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when user has locations', function () {
      beforeEach(function () {
        req.session.user = {
          locations: [mockLocation, { id: 2 }, { id: 3 }],
        }
        currentLocation(req, {}, nextSpy)
      })

      it('should set currentLocation property on session', function () {
        expect(req.session).to.have.property('currentLocation')
      })

      it('should set value to first location', function () {
        expect(req.session.currentLocation).to.equal(mockLocation)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
