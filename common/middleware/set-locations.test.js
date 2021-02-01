const setLocations = require('./set-locations')

describe('Set locations middleware', function () {
  describe('#setLocations', function () {
    const next = sinon.stub()
    const res = {}
    let req

    beforeEach(function () {
      req = {
        params: {},
        session: {},
      }
    })

    context('when the user has a current location', function () {
      beforeEach(function () {
        req.session.currentLocation = { id: '#currentLocation' }
        req.session.currentRegion = {
          locations: [{ id: '#currentRegion' }],
        }
        req.session.user = {
          locations: [{ id: '#userLocations' }],
        }
        setLocations(req, res, next)
      })

      it('set the locations to an array containing the id of the current location', function () {
        expect(req.locations).to.deep.equal(['#currentLocation'])
      })
    })

    context('when the user has a current region', function () {
      beforeEach(function () {
        req.session.currentRegion = {
          locations: [{ id: '#currentRegion' }],
        }
        req.session.user = {
          locations: [{ id: '#userLocations' }],
        }
        setLocations(req, res, next)
      })

      it('set the locations to an array of the ids of the current region locations', function () {
        expect(req.locations).to.deep.equal(['#currentRegion'])
      })
    })

    context(
      'when the user has neither current region or location',
      function () {
        beforeEach(function () {
          req.session.user = {
            locations: [{ id: '#userLocations' }],
          }
          setLocations(req, res, next)
        })

        it('set the locations to an array of the ids of the user’s locations', function () {
          expect(req.locations).to.deep.equal(['#userLocations'])
        })
      }
    )

    context('when the user has no locations', function () {
      beforeEach(function () {
        setLocations(req, res, next)
      })

      it('set the locations to an empty array', function () {
        expect(req.locations).to.deep.equal([])
      })
    })

    context('when a supplier has a current location', function () {
      beforeEach(function () {
        req.session.currentLocation = { id: '#currentLocation' }
        req.session.user = {
          supplierId: '#supplier',
          locations: [{ id: '#userLocations' }],
        }
        setLocations(req, res, next)
      })

      it('set the locations to the current location', function () {
        expect(req.locations).to.deep.equal(['#currentLocation'])
      })
    })

    context(
      'when a supplier has neither current region or location',
      function () {
        beforeEach(function () {
          req.session.user = {
            supplierId: '#supplier',
            locations: [{ id: '#userLocations' }],
          }
          setLocations(req, res, next)
        })

        it('set the locations to an empty array', function () {
          expect(req.locations).to.deep.equal([])
        })
      }
    )
  })
})
