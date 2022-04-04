const eventToTimelinePanel = require('./event-to-timeline-panel')

function toPanelList(lockoutEvents, otherEvents, move) {
  const lockoutPanels = lockoutEvents.map(event =>
    eventToTimelinePanel(event, move)
  )
  const otherPanels = otherEvents.map(event =>
    eventToTimelinePanel(event, move)
  )

  const panelList = {
    key: 'in-transit-events',
    name: 'In transit information',
    isCompleted: true,
    count: lockoutPanels.length + otherPanels.length,
    context: 'framework',
  }

  if (lockoutPanels.length) {
    panelList.groupedPanels = [
      {
        panels: otherPanels,
      },
      {
        heading: 'Lockout events',
        panels: lockoutPanels,
      },
    ]
  } else {
    panelList.panels = otherPanels
  }

  return panelList
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

  const lockoutEvents = importantEvents.filter(({ supplier }) => !supplier)
  const otherEvents = importantEvents.filter(({ supplier }) => !!supplier)

  return toPanelList(lockoutEvents, otherEvents, move)
}
