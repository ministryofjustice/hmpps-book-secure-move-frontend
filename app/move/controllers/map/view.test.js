const proxyquire = require('proxyquire').noCallThru()

const journeysToMetaListComponent = sinon.stub()
const config = {
  MAPPING: {
    TILE_URL: 'http://example.com/x/y/z',
  },
}

const controller = proxyquire('./view', {
  '../../../../common/presenters/journeys-to-meta-list-component': journeysToMetaListComponent,
  '../../../../config': config,
})

describe('Map controllers', function () {
  describe('#view()', function () {
    let req, res, params

    beforeEach(function () {
      journeysToMetaListComponent.resetHistory()
      journeysToMetaListComponent.returns({
        list: 'component',
      })

      req = {
        foo: 'bar',
        move: {
          id: 'FACEFEED',
        },
        journeys: [{ id: 'ABADCAFE' }, { id: 'DEADBEEF' }],
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
        expect(res.render.calledOnce).to.be.true
      })

      it('should render a template', function () {
        expect(res.render).to.have.been.calledWith('move/views/map')
      })

      it('should pass correct number of locals to template', function () {
        expect(params).to.deep.equal({
          finalJourney: { id: 'DEADBEEF' },
          journeySummary: {
            list: 'component',
          },
          journeysUrl: '/move/FACEFEED/map/journeys.geo.json',
          locationsUrl: '/move/FACEFEED/map/locations.geo.json',
          tileUrl: 'http://example.com/x/y/z',
        })
      })
    })
  })
})
