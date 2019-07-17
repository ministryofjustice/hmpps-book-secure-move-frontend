const currentLocation = require('./current-location')

const referenceDataService = require('../../common/services/reference-data')

const mockId = 'ce337679-1741-4ced-b592-fab7b5c0d388'
const mockLocation = {
  id: 'ce337679-1741-4ced-b592-fab7b5c0d388',
  key: 'hmirc_dover',
  title: 'HMIRC Dover',
}

describe('Current location middleware', function () {
  let req, nextSpy

  beforeEach(function () {
    sinon.stub(referenceDataService, 'getLocationById')
    nextSpy = sinon.spy()
    req = { session: {} }
  })

  context('when current user has supplier role', function () {
    beforeEach(function () {
      req.session.userInfo = {
        authorities: ['ROLE_PECS_SUPPLIER'],
      }
      currentLocation(mockId)(req, {}, nextSpy)
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not call reference service', function () {
      expect(referenceDataService.getLocationById).not.to.be.called
    })
  })

  context('when location already exists in session', function () {
    beforeEach(function () {
      req.session.currentLocation = 'location-value'
      currentLocation(mockId)(req, {}, nextSpy)
    })

    it('should not mutate value on session', function () {
      expect(req.session.currentLocation).to.equal('location-value')
    })

    it('should call next without error', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should not call reference service', function () {
      expect(referenceDataService.getLocationById).not.to.be.called
    })
  })

  context("when location doesn't exist in session", function () {
    context('when location service returns a location', function () {
      beforeEach(async function () {
        referenceDataService.getLocationById.resolves(mockLocation)
        await currentLocation(mockId)(req, {}, nextSpy)
      })

      it('should call location service with location ID', function () {
        expect(
          referenceDataService.getLocationById
        ).to.be.calledOnceWithExactly(mockId)
      })

      it('should add a current location property to the session', function () {
        expect(req.session).to.have.property('currentLocation')
      })

      it('should set correct value to session property', function () {
        expect(req.session.currentLocation).to.equal(mockLocation)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context("when location service doesn't return a location", function () {
      beforeEach(async function () {
        referenceDataService.getLocationById.resolves(undefined)
        await currentLocation(mockId)(req, {}, nextSpy)
      })

      it('should call location service with location ID', function () {
        expect(
          referenceDataService.getLocationById
        ).to.be.calledOnceWithExactly(mockId)
      })

      it('should add a current location property to the session', function () {
        expect(req.session).to.have.property('currentLocation')
      })

      it('should set value to undefined', function () {
        expect(req.session.currentLocation).to.equal(undefined)
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when location service return an error', function () {
      const mockError = new Error('Location error')

      beforeEach(async function () {
        referenceDataService.getLocationById.rejects(mockError)
        await currentLocation(mockId)(req, {}, nextSpy)
      })

      it('should call location service with location ID', function () {
        expect(
          referenceDataService.getLocationById
        ).to.be.calledOnceWithExactly(mockId)
      })

      it('should not add a current location property to the session', function () {
        expect(req.session).not.to.have.property('currentLocation')
      })

      it('should call next with error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(mockError)
      })
    })
  })
})
