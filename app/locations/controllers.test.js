const { sortBy } = require('lodash')

const controllers = require('./controllers')

const {
  data: userLocations,
} = require('../../test/fixtures/api-client/reference.locations.deserialized.json')

describe('Locations controllers', function() {
  let req, res

  describe('#locations', function() {
    beforeEach(function() {
      req = {
        session: {},
        userLocations: userLocations,
      }
      res = {
        render: sinon.spy(),
      }
      controllers.locations(req, res)
    })

    it('should render template', function() {
      expect(res.render).to.be.calledOnce
    })

    it('should return locations sorted by title', function() {
      const params = res.render.args[0][1]
      expect(params).to.have.property('locations')
      expect(params.locations).to.deep.equal(sortBy(userLocations, 'title'))
    })
  })

  describe('#setLocation', function() {
    let nextSpy

    beforeEach(function() {
      req = {
        session: {},
        params: {},
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when no locationId parameter supplied', function() {
      beforeEach(function() {
        controllers.setLocation(req, res, nextSpy)
      })

      it('should call next without args', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not set currentLocation', function() {
        expect(req.session).not.to.have.property('currentLocation')
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when locationId is not found in user locations', function() {
      beforeEach(function() {
        req.params.locationId = 'not_authorised'
        req.userLocations = userLocations

        controllers.setLocation(req, res, nextSpy)
      })

      it('should call next without args', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not set currentLocation', function() {
        expect(req.session).not.to.have.property('currentLocation')
      })

      it('should not redirect', function() {
        expect(res.redirect).not.to.be.called
      })
    })

    context('when locationId is found in user locations', function() {
      beforeEach(function() {
        req.params.locationId = userLocations[0].id
        req.userLocations = userLocations

        controllers.setLocation(req, res, nextSpy)
      })

      it('should set currentLocation', function() {
        expect(req.session).to.have.property('currentLocation')
        expect(req.session.currentLocation).to.deep.equal(userLocations[0])
      })

      it('should redirect to homepage', function() {
        expect(res.redirect).to.be.calledOnceWithExactly('/')
      })

      it('should not call next', function() {
        expect(nextSpy).not.to.be.called
      })
    })
  })
})
