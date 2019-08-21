const middleware = require('./middleware')

const {
  data: userLocations,
} = require('../../test/fixtures/api-client/reference.locations.deserialized.json')

describe('Locations middleware', function() {
  let req, res, nextSpy

  describe('#setUserLocations', function() {
    beforeEach(function() {
      req = {
        session: {},
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when no user exists on session', function() {
      beforeEach(function() {
        middleware.setUserLocations(req, res, nextSpy)
      })

      it('should set empty user locations on request', function() {
        expect(req).to.have.property('userLocations')
        expect(req.userLocations).to.be.an('array').that.is.empty
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when locations exists on user', function() {
      beforeEach(function() {
        req.session.user = {
          locations: userLocations,
        }

        middleware.setUserLocations(req, res, nextSpy)
      })

      it('should set locations on request', function() {
        expect(req).to.have.property('userLocations')
        expect(req.userLocations).to.deep.equal(userLocations)
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#checkLocationsLength', function() {
    const baseUrl = '/locations'

    beforeEach(function() {
      req = {
        baseUrl,
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when user only has one location', function() {
      beforeEach(function() {
        req.userLocations = userLocations.slice(0, 1)
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should redirect to location ID', function() {
        expect(res.redirect).to.be.calledOnceWithExactly(
          `${baseUrl}/${req.userLocations[0].id}`
        )
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when user has multiple locations', function() {
      beforeEach(function() {
        req.userLocations = userLocations
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when user has no locations', function() {
      beforeEach(function() {
        req.userLocations = []
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })

      it('should call next', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
