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
        '\n    <div class="app-timeline__description">eventType.description</div>\n    <div class="app-timeline__date">\n      <time datetime="2020-01-01T10:00:00Z">10:00 on Wednesday 1 Jan 2020</time>\n    </div>\n  '
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
