const proxyquire = require('proxyquire')

const eventToTimelinePanel = sinon.stub().returns('panel')

const moveToInTransitEventsPanelList = proxyquire(
  './move-to-in-transit-events-panel-list',
  { './event-to-timeline-panel': eventToTimelinePanel }
)

describe('Presenters', function () {
  describe('#moveToInTransitEventsPanelList()', function () {
    const move = {
      id: 'abc',
      timeline_events: [
        {
          classification: 'incident',
          occurred_at: '2020-01-01',
        },
        {
          classification: 'incident',
          occurred_at: '2020-01-02',
        },
        {
          classification: 'default',
        },
      ],
    }

    let panelList
    beforeEach(function () {
      panelList = moveToInTransitEventsPanelList(move)
    })

    it('should return panels for incident events', function () {
      expect(panelList).to.deep.equal({
        context: 'framework',
        count: 2,
        isCompleted: true,
        key: 'in-transit-events',
        name: 'In transit information',
        panels: ['panel', 'panel'],
      })
    })
  })
})
