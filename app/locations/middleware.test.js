const proxyquire = require('proxyquire').noCallThru()

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

  describe('#checkLocationsLength', function () {
    const baseUrl = '/locations'

    beforeEach(function () {
      req = {
        baseUrl,
        session: {
          user: {},
        },
      }
      res = {
        redirect: sinon.spy(),
      }
      nextSpy = sinon.spy()
    })

    context('when user only has one location', function () {
      beforeEach(function () {
        req.session.user.locations = mockUserLocations.slice(0, 1)
        middleware.checkLocationsLength(req, res, nextSpy)
      })

      it('should redirect to location ID', function () {
        expect(res.redirect).to.be.calledOnceWithExactly(
          `${baseUrl}/${req.session.user.locations[0].id}`
        )
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when user has multiple locations', function () {
      beforeEach(function () {
        req.session.user.locations = mockUserLocations
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
        req.session.user.locations = []
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

    const originalSession = { user: {} }
    beforeEach(function () {
      sinon.stub(middleware, 'setSelectedLocation')
      req = {
        session: { ...originalSession },
        params: {},
        query: {},
      }
      nextSpy = sinon.spy()
    })

    context('when locationId is not found in user locations', function () {
      beforeEach(function () {
        req.params.locationId = 'not_authorised'
        req.session.user.locations = mockUserLocations

        middleware.setLocation(req, {}, nextSpy)
      })

      it('should send a 404', function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.firstCall.args[0].statusCode).to.equal(404)
      })

      it('should not set currentLocation', function () {
        expect(middleware.setSelectedLocation).to.not.be.called
      })
    })

    context('when locationId is found in user locations', function () {
      beforeEach(function () {
        req.params.locationId = mockUserLocations[0].id
        req.session.user.locations = mockUserLocations

        middleware.setLocation(req, {}, nextSpy)
      })

      it('should set currentLocation', function () {
        expect(middleware.setSelectedLocation).to.be.calledOnceWithExactly(
          req,
          'currentLocation',
          mockUserLocations[0]
        )
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setAllLocations', function () {
    let nextSpy

    beforeEach(function () {
      sinon.stub(middleware, 'setSelectedLocation')
      req = {
        session: {},
      }
      nextSpy = sinon.spy()
      middleware.setAllLocations(req, res, nextSpy)
    })

    it('should call next', function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })

    it('should call unset any currently selected location', function () {
      expect(middleware.setSelectedLocation).to.be.calledOnceWithExactly(req)
    })
  })

  describe('#setRegion', function () {
    const proxiedMiddleware = proxyquire('./middleware', {})
    const currentRegion = { id: '1' }
    const mockReferenceData = {
      getRegionById: sinon.fake.returns(Promise.resolve(currentRegion)),
    }
    let nextSpy

    beforeEach(function () {
      sinon.stub(proxiedMiddleware, 'setSelectedLocation')
      req = {
        params: {
          regionId: '1',
        },
        services: {
          referenceData: mockReferenceData,
        },
      }
      nextSpy = sinon.spy()
    })

    context('when the region is found', async function () {
      beforeEach(async function () {
        await proxiedMiddleware.setRegion(req, {}, nextSpy)
      })

      it('should set currentLocation', function () {
        expect(
          proxiedMiddleware.setSelectedLocation
        ).to.be.calledOnceWithExactly(req, 'currentRegion', currentRegion)
      })

      it('should call next without args', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when the region is not found', async function () {
      const error = new Error()
      beforeEach(async function () {
        req.services.referenceData.getRegionById = sinon.fake.returns(
          Promise.reject(error)
        )
        await proxiedMiddleware.setRegion(req, {}, nextSpy)
      })

      it('should not set currentLocation', function () {
        expect(proxiedMiddleware.setSelectedLocation).to.not.be.called
      })

      it('should call next with error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly(error)
      })
    })

    context('when no region is returned', async function () {
      beforeEach(async function () {
        mockReferenceData.getRegionById = sinon.fake.returns(Promise.resolve())
        await proxiedMiddleware.setRegion(req, {}, nextSpy)
      })

      it('should not set currentLocation', function () {
        expect(proxiedMiddleware.setSelectedLocation).to.not.be.called
      })

      it('should send a 404', function () {
        expect(nextSpy).to.be.calledOnce
        expect(nextSpy.firstCall.args[0].statusCode).to.equal(404)
      })
    })
  })

  describe('#setHasSelectedLocation', function () {
    let nextSpy

    beforeEach(async function () {
      req = {
        session: {},
      }
      nextSpy = sinon.spy()
      await middleware.setHasSelectedLocation(req, {}, nextSpy)
    })

    it('should not set hasSelectedLocation property', async function () {
      expect(req.session.hasSelectedLocation).to.equal(true)
    })

    it('should call next', async function () {
      expect(nextSpy).to.be.calledOnceWithExactly()
    })
  })

  describe('#setSelectedLocation', function () {
    beforeEach(async function () {
      req = {
        session: {
          currentLocation: 'currentLocation',
          currentRegion: 'currentRegion',
        },
      }
    })

    context('when called with no location type', function () {
      beforeEach(async function () {
        middleware.setSelectedLocation(req)
      })

      it('it should delete the currentLocation', async function () {
        expect(req.session).to.not.have.property('currentLocation')
      })

      it('it should delete the currentRegion', async function () {
        expect(req.session).to.not.have.property('currentRegion')
      })
    })

    context('when called with currentLocation as location type', function () {
      beforeEach(async function () {
        middleware.setSelectedLocation(req, 'currentLocation', 'foo')
      })

      it('it should set the currentLocation', async function () {
        expect(req.session.currentLocation).to.equal('foo')
      })

      it('it should delete the currentRegion', async function () {
        expect(req.session).to.not.have.property('currentRegion')
      })
    })

    context('when called with currentRegion as location type', function () {
      beforeEach(async function () {
        middleware.setSelectedLocation(req, 'currentRegion', 'foo')
      })

      it('it should set the currentRegion', async function () {
        expect(req.session.currentRegion).to.equal('foo')
      })

      it('it should delete the currentLocation', async function () {
        expect(req.session).to.not.have.property('currentLocation')
      })
    })
  })
})
