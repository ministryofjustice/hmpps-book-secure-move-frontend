const proxyquire = require('proxyquire').noCallThru()

const journeysToLineStringsGeoJSONStub = sinon.stub()

const controller = proxyquire('./journeys-geo-json', {
  '../../../../common/presenters/journeys-to-linestrings-geojson': journeysToLineStringsGeoJSONStub,
})

describe('Map controllers', function () {
  describe('#journeys-geo-json()', function () {
    let req, res

    beforeEach(function () {
      journeysToLineStringsGeoJSONStub.resetHistory()
      journeysToLineStringsGeoJSONStub.returns({
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
        expect(journeysToLineStringsGeoJSONStub).to.be.calledWithMatch({
          journeys: req.journeys,
          locationLookup: req.user.locations,
          useCentrePointFillIn: true,
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
