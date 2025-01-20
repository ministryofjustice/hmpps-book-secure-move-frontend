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
        {
          classification: 'suicide_and_self_harm',
        },
      ],
    }

    let panelList

    context('when the move is a lockout', function () {
      beforeEach(async function () {
        move.is_lockout = true
        panelList = await moveToInTransitEventsPanelList('token', move)
      })

      it('should return panels for incident and lockout events', function () {
        expect(panelList).to.deep.equal({
          context: 'framework',
          count: 3,
          isCompleted: true,
          key: 'in-transit-events',
          name: 'In transit information',
          groupedPanels: [
            {
              panels: ['panel'],
            },
            {
              heading: 'Lockout events',
              panels: ['panel', 'panel'],
            },
          ],
        })
      })
    })

    context('when the move is not a lockout', function () {
      beforeEach(async function () {
        move.is_lockout = false
        panelList = await moveToInTransitEventsPanelList('token', move)
      })

      it('should return panels for incident and overnight lodge events', function () {
        expect(panelList).to.deep.equal({
          context: 'framework',
          count: 3,
          isCompleted: true,
          key: 'in-transit-events',
          name: 'In transit information',
          groupedPanels: [
            {
              panels: ['panel'],
            },
            {
              heading: 'Overnight lodge events',
              panels: ['panel', 'panel'],
            },
          ],
        })
      })
    })
  })
})
