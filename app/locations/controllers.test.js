const controllers = require('./controllers')

describe('Locations controllers', function() {
  let req, res
  const userLocations = [
    {
      id: 'test2',
      title: 'Test Police 2',
      location_type: 'police',
    },
    {
      id: 'testcourt',
      title: 'Test Court',
      location_type: 'court',
    },
    {
      id: 'test1',
      title: 'Test Police 1',
      location_type: 'police',
    },
    {
      id: 'testprison',
      title: 'Test Prison',
      location_type: 'prison',
    },
  ]

  describe('#locations', function() {
    beforeEach(function() {
      req = {
        session: {},
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('when no user exists on session', function() {
      beforeEach(function() {
        controllers.locations(req, res)
      })

      it('should render template', function() {
        expect(res.render).to.be.calledOnce
      })

      it('should return empty list for locations', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('locations')
        expect(params.locations).to.deep.equal([])
      })
    })

    context('when locations exists on user', function() {
      beforeEach(function() {
        req.session.user = {
          locations: userLocations,
        }

        controllers.locations(req, res)
      })

      it('should render template', function() {
        expect(res.render).to.be.calledOnce
      })

      it('should return locations sorted by title', function() {
        const params = res.render.args[0][1]
        expect(params).to.have.property('locations')
        expect(params.locations).to.deep.equal([
          {
            id: 'testcourt',
            title: 'Test Court',
            location_type: 'court',
          },
          {
            id: 'test1',
            title: 'Test Police 1',
            location_type: 'police',
          },
          {
            id: 'test2',
            title: 'Test Police 2',
            location_type: 'police',
          },
          {
            id: 'testprison',
            title: 'Test Prison',
            location_type: 'prison',
          },
        ])
      })
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

    context('when no user exists', function() {
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
        req.session.user = {
          locations: userLocations,
        }

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
        req.params.locationId = 'test1'
        req.session.user = {
          locations: userLocations,
        }

        controllers.setLocation(req, res, nextSpy)
      })

      it('should set currentLocation', function() {
        expect(req.session).to.have.property('currentLocation')
        expect(req.session.currentLocation).to.deep.equal({
          id: 'test1',
          title: 'Test Police 1',
          location_type: 'police',
        })
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
