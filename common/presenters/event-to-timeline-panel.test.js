const eventToTimelinePanel = require('./event-to-timeline-panel')

describe('Presenters', function () {
  describe('#eventToTimelinePanel()', function () {
    const event = {
      id: 'event',
      classification: 'incident',
      event_type: 'eventType',
      occurred_at: '2020-01-01T10:00:00Z',
      supplier: '12341-12312132',
    }

    const move = { id: 'move' }

    let timelinePanel
    beforeEach(async function () {
      timelinePanel = await eventToTimelinePanel('token', event, move)
    })

    it('should return tag for the event', function () {
      expect(timelinePanel.tag).to.deep.equal({
        classes: 'app-tag app-tag--destructive',
        flag: {
          html: 'Serious incident',
          type: 'incident',
        },
        html: 'eventType.heading',
        id: 'event',
      })
    })

    it('should return html for the event', function () {
      expect(timelinePanel.html).to.equal(
        `<table class="govuk-table"><tbody class="govuk-table__body"><div class="app-timeline__description">eventType.description</div></tbody></table><p><time datetime="{{ formattedDate }}" class="app-timeline__date govuk-!-width-full">10:00 on Wednesday 1 Jan 2020</time></p>`
      )
    })

    it('should return attributes for the event', function () {
      expect(timelinePanel.attributes).to.deep.equal({ id: 'event' })
    })

    it('should return isFocusable for the event', function () {
      expect(timelinePanel.isFocusable).to.be.true
    })
  })
})
