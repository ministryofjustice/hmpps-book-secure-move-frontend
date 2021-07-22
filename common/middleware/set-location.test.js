const setLocation = require('./set-location')

describe('Set location middleware', function () {
  describe('#setLocation', function () {
    let next
    const res = {}
    let req

    beforeEach(function () {
      req = {
        params: {},
        session: {},
        services: {
          referenceData: {
            getRegions: sinon.stub(),
          },
        },
      }
      next = sinon.stub()
    })

    context('without a param or session location', function () {
      beforeEach(function () {
        setLocation(req, res, next)
      })

      it('should call next', function () {
        expect(next).to.have.been.calledWithExactly()
      })

      it('should not set req.location', function () {
        expect(req.location).to.be.undefined
      })
    })

    context('with param location', function () {
      beforeEach(function () {
        req.params.locationId = 'ABADCAFE'
      })

      context('found in userLocations', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'ABADCAFE' }],
          }

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('found in session currentRegion locations', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'FACEFEED' }],
          }
          req.session.currentRegion = {
            locations: [{ id: 'ABADCAFE' }],
          }

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('found in all regions', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'FACEFEED' }],
          }
          req.session.currentRegion = {
            locations: [{ id: 'FACEFEED' }],
          }

          const allRegions = [
            { id: 'region1', locations: [{ id: 'DEADBEEF' }] },
            {
              id: 'region2',
              locations: [{ id: 'FACEFEED' }, { id: 'ABADCAFE' }],
            },
          ]
          req.services.referenceData.getRegions.resolves(allRegions)

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('not found', function () {
        beforeEach(async function () {
          await setLocation(req, res, next)
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error))
          expect(next).to.have.been.calledWithMatch({
            message: 'Location not found',
            statusCode: 404,
          })
        })

        it('should not set req.location', function () {
          expect(req.location).to.be.undefined
        })
      })
    })

    context('with session location', function () {
      beforeEach(function () {
        delete req.params.locationId
        req.session.currentLocation = {
          id: 'ABADCAFE',
        }
      })

      context('found in userLocations', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'ABADCAFE' }],
          }

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('found in session currentRegion locations', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'FACEFEED' }],
          }
          req.session.currentRegion = {
            locations: [{ id: 'ABADCAFE' }],
          }

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('found in all regions', function () {
        beforeEach(async function () {
          req.session.user = {
            locations: [{ id: 'FACEFEED' }],
          }
          req.session.currentRegion = {
            locations: [{ id: 'FACEFEED' }],
          }

          const allRegions = [
            { id: 'region1', locations: [{ id: 'DEADBEEF' }] },
            {
              id: 'region2',
              locations: [{ id: 'FACEFEED' }, { id: 'ABADCAFE' }],
            },
          ]
          req.services.referenceData.getRegions.resolves(allRegions)

          await setLocation(req, res, next)
        })

        it('should set req.location', function () {
          expect(req.location).to.deep.equal({ id: 'ABADCAFE' })
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWithExactly()
        })
      })

      context('not found', function () {
        beforeEach(async function () {
          await setLocation(req, res, next)
        })

        it('should call next', function () {
          expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error))
          expect(next).to.have.been.calledWithMatch({
            message: 'Location not found',
            statusCode: 404,
          })
        })

        it('should not set req.location', function () {
          expect(req.location).to.be.undefined
        })
      })
    })
  })
})
