const { sortBy } = require('lodash')

const controllers = require('./controllers')

const mockUserLocations = [
  {
    id: '2c952ca0-f750-4ac3-ac76-fb631445f974',
    title: 'D location',
  },
  {
    id: '9b56ca31-222b-4522-9d65-4ef429f9081e',
    title: 'B location',
  },
  {
    id: 'd8e9cf86-55cd-4412-83b7-3562b7d1f8b6',
    title: 'A location',
  },
  {
    id: '10923762-bc17-4ea1-bae3-68ea709ee23e',
    title: 'C location',
  },
]

describe('Locations controllers', function() {
  let req, res

  describe('#locations', function() {
    beforeEach(function() {
      req = {
        session: {},
        userLocations: mockUserLocations,
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
      expect(params.locations).to.deep.equal(sortBy(mockUserLocations, 'title'))
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
        req.userLocations = mockUserLocations

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
        req.params.locationId = mockUserLocations[0].id
        req.userLocations = mockUserLocations

        controllers.setLocation(req, res, nextSpy)
      })

      it('should set currentLocation', function() {
        expect(req.session).to.have.property('currentLocation')
        expect(req.session.currentLocation).to.deep.equal(mockUserLocations[0])
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
