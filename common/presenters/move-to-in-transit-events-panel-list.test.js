const proxyquire = require('proxyquire')

const eventToTimelinePanel = sinon.stub().resolves('panel')

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
          supplier: 'ABC',
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
    beforeEach(async function () {
      panelList = await moveToInTransitEventsPanelList('token', move)
    })

    it('should return panels for incident and lockout events', function () {
      expect(panelList).to.deep.equal({
        context: 'framework',
        count: 2,
        isCompleted: true,
        key: 'in-transit-events',
        name: 'In transit information',
        groupedPanels: [
          {
            panels: ['panel'],
          },
          {
            heading: 'Lockout events',
            panels: ['panel'],
          },
        ],
      })
    })
  })
})
