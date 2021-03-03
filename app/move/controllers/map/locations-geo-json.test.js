const proxyquire = require('proxyquire').noCallThru()

const journeysToPointsGeoJSONStub = sinon.stub()

const controller = proxyquire('./locations-geo-json', {
  '../../../../common/presenters/journeys-to-points-geojson': journeysToPointsGeoJSONStub,
})

describe('Map controllers', function () {
  describe('#locations-geo-json()', function () {
    let req, res

    beforeEach(function () {
      journeysToPointsGeoJSONStub.resetHistory()
      journeysToPointsGeoJSONStub.returns({
        type: 'FeatureCollection',
        features: [],
      })

      req = {
        journeys: [{ id: 'FACEFEED' }],
        user: {
          locations: [{ id: 'ABADCAFE' }],
        },
      }

      res = {
        json: sinon.spy(),
        status: sinon.spy(),
      }
    })

    describe('by default', function () {
      beforeEach(async function () {
        await controller(req, res)
      })

      it('should call journeysToPointsGeoJSON with journeys and locationLookup', function () {
        expect(journeysToPointsGeoJSONStub).to.be.calledWithMatch({
          journeys: req.journeys,
          locationLookup: req.user.locations,
        })
      })

      it('should call res.status with 200', function () {
        expect(res.status).to.have.been.calledWith(200)
      })

      it('should call res.json with Feature Collection', function () {
        expect(res.json).to.have.been.calledWithMatch({
          type: 'FeatureCollection',
          features: [],
        })
      })
    })
  })
})
