const proxyquire = require('proxyquire').noCallThru()

const journeysToSummaryList = sinon.stub().returnsArg(0)
const journeysToGeoJsonLines = sinon.stub().returnsArg(0)
const locationsToGeoJsonPoints = sinon.stub().returnsArg(0)
const config = {
  MAPPING: {
    TILE_URL: 'http://example.com/x/y/z',
  },
}

const controller = proxyquire('./journeys', {
  '../../../common/presenters/journeys-to-meta-list-component':
    journeysToSummaryList,
  '../../../common/presenters/journeys-to-geo-json-lines':
    journeysToGeoJsonLines,
  '../../../common/presenters/locations-to-geo-json-points':
    locationsToGeoJsonPoints,
  '../../../config': config,
})

describe('Map controllers', function () {
  describe('#journeys()', function () {
    let req, res, params

    beforeEach(function () {
      journeysToSummaryList.resetHistory()
      journeysToGeoJsonLines.resetHistory()
      locationsToGeoJsonPoints.resetHistory()

      req = {
        foo: 'bar',
        move: {
          id: 'FACEFEED',
          from_location: {
            id: '1',
          },
          to_location: {
            id: '3',
          },
        },
        journeys: [
          {
            id: 'ABADCAFE',
            from_location: {
              id: '1',
            },
            to_location: {
              id: '2',
            },
          },
          {
            id: 'DEADBEEF',
            from_location: {
              id: '2',
            },
            to_location: {
              id: '3',
            },
          },
        ],
      }
      res = {
        render: sinon.spy(),
      }
    })

    context('by default', function () {
      beforeEach(async function () {
        await controller(req, res)
        params = res.render.args[0][1]
      })

      it('should render a template', function () {
        expect(res.render).to.have.been.calledOnceWith('move/views/journeys')
      })

      it('should pass correct number of locals to template', function () {
        expect(params).to.deep.equal({
          move: req.move,
          journeys: req.journeys,
          geoData: {
            points:
              '[{"id":"1","start":true},{"id":"3","end":true},{"id":"1"},{"id":"2"},{"id":"2"},{"id":"3"}]',
            lines: JSON.stringify(req.journeys),
          },
          tileUrl: 'http://example.com/x/y/z',
        })
      })
    })
  })
})
