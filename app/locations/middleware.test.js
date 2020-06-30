const middleware = require('./middleware')

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

describe('Locations middleware', function () {
  let req, res, nextSpy

  describe('#setUserLocations', function () {
    beforeEach(function () {
      req = {
        session: {},
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when no user exists on session', function () {
      beforeEach(function () {
        middleware.setUserLocations(req, res, nextSpy)
      })

      it('should set empty user locations on request', function () {
        expect(req).to.have.property('userLocations')
        expect(req.userLocations).to.be.an('array').that.is.empty
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when locations exists on user', function () {
      beforeEach(function () {
        req.session.user = {
          locations: mockUserLocations,
        }

        middleware.setUserLocations(req, res, nextSpy)
      })

      it('should set locations on request', function () {
        expect(req).to.have.property('userLocations')
        expect(req.userLocations).to.deep.equal(mockUserLocations)
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#checkLocationsLength', function () {
    const baseUrl = '/locations'

    beforeEach(function () {
      req = {
        baseUrl,
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when user only has one location', function () {
      beforeEach(function () {
        req.userLocations = mockUserLocations.slice(0, 1)
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should redirect to location ID', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          `${baseUrl}/${req.userLocations[0].id}`
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when user has multiple locations', function () {
      beforeEach(function () {
        req.userLocations = mockUserLocations
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when user has no locations', function () {
      beforeEach(function () {
        req.userLocations = []
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should not redirect', function () {
        expect(res.redirect).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setLocation', function () {
    let nextSpy

    beforeEach(function () {
      req = {
        session: {},
        params: {},
        query: {},
      }
      nextSpy = sinon.spy()
    })

    context('when no locationId parameter supplied', function () {
      beforeEach(function () {
        middleware.setLocation(req, {}, nextSpy)
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should set currentLocation to undefined', function () {
        expect(req.session.currentLocation).to.be.undefined
      })
    })

    context('when locationId is not found in user locations', function () {
      beforeEach(function () {
        req.params.locationId = 'not_authorised'
        req.userLocations = mockUserLocations

        middleware.setLocation(req, {}, nextSpy)
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should set currentLocation to undefined', function () {
        expect(req.session.currentLocation).to.be.undefined
      })
    })

    context('when locationId is found in user locations', function () {
      beforeEach(function () {
        req.params.locationId = mockUserLocations[0].id
        req.userLocations = mockUserLocations

        middleware.setLocation(req, {}, nextSpy)
      })

      it('should set currentLocation', function () {
        expect(req.session).to.have.property('currentLocation')
        expect(req.session.currentLocation).to.deep.equal(mockUserLocations[0])
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setAllLocations', function () {
    let nextSpy

    beforeEach(function () {
      req = {
        session: {},
      }
      nextSpy = sinon.spy()
    })

    context('when user does not have permission', function () {
      context('if current location does not exist', function () {
        beforeEach(function () {
          middleware.setAllLocations(req, {}, nextSpy)
        })

        it('should call next without args', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })

        it('should not set currentLocation', function () {
          expect(req.session).not.to.have.property('currentLocation')
        })
      })

      context('if current location already exists', function () {
        beforeEach(function () {
          req.session.currentLocation = '1234567890'
          middleware.setAllLocations(req, {}, nextSpy)
        })

        it('should call next without args', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })

        it('should not change currentLocation', function () {
          expect(req.session.currentLocation).to.equal('1234567890')
        })
      })
    })

    context('when locationId is found in user locations', function () {
      beforeEach(function () {
        req.session.user = {
          permissions: ['locations:all'],
        }

        middleware.setAllLocations(req, {}, nextSpy)
      })

      it('should set currentLocation', function () {
        expect(req.session).to.have.property('currentLocation')
        expect(req.session.currentLocation).to.equal(null)
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setRegion', function () {
    const currentRegion = { id: '1' }
    let nextSpy

    beforeEach(function () {
      req = {
        session: {
          regions: [currentRegion],
        },
        params: {},
      }
      nextSpy = sinon.spy()
    })

    context('when the region is set', function () {
      it('should select the current region from all regions', async function () {
        req.params.regionId = '1'
        middleware.setRegion(req, {}, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
        expect(req.session.currentRegion).to.deep.equal(currentRegion)
      })
    })

    context('otherwise', function () {
      it('should not set the current region', async function () {
        middleware.setRegion(req, {}, nextSpy)
        expect(nextSpy).to.be.calledOnceWithExactly()
        expect(req.session.currentRegion).to.equal(undefined)
      })
    })
  })
})
