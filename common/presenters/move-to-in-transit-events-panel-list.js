const eventToTimelinePanel = require('./event-to-timeline-panel')

function toPanelList(events, move) {
  const panels = events.map(event => eventToTimelinePanel(event, move))

  return {
    key: 'in-transit-events',
    name: 'In transit information',
    isCompleted: true,
    count: panels.length,
    context: 'framework',
    panels: panels,
  }
}

module.exports = function (move = {}) {
  const { timeline_events: timelineEvents = [] } = move

  const importantEvents = timelineEvents
    .filter(
      ({ event_type: eventType, classification }) =>
        eventType === 'PerPropertyChange' || classification === 'incident'
    )
    .sort(({ occurred_at: occurredAtA }, { occurred_at: occurredAtB }) =>
      occurredAtA > occurredAtB ? -1 : 1
    )

  return toPanelList(importantEvents, move)
}
