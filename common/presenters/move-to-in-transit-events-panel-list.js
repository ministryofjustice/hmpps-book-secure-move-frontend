const eventToTimelinePanel = require('./event-to-timeline-panel')

async function toPanelList(token, lockoutEvents, otherEvents, move) {
  const lockoutPanels = await Promise.all(
    lockoutEvents.map(event => eventToTimelinePanel(token, event, move))
  )
  const otherPanels = await Promise.all(
    otherEvents.map(event => eventToTimelinePanel(token, event, move))
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
        heading: `${move.is_lockout ? 'Lockout' : 'Overnight lodge'} events`,
        panels: lockoutPanels,
      },
    ]
  } else {
    panelList.panels = otherPanels
  }

  return panelList
}

module.exports = async function (token, move = {}) {
  const { timeline_events: timelineEvents = [] } = move

  const importantEvents = timelineEvents
    .filter(
      ({ event_type: eventType, classification }) =>
        eventType === 'PerPropertyChange' ||
        ['incident', 'medical', 'suicide_and_self_harm'].includes(
          classification
        )
    )
    .sort(({ occurred_at: occurredAtA }, { occurred_at: occurredAtB }) =>
      occurredAtA > occurredAtB ? -1 : 1
    )

  const lockoutEvents = importantEvents.filter(({ supplier }) => !supplier)
  const otherEvents = importantEvents.filter(({ supplier }) => !!supplier)

  return await toPanelList(token, lockoutEvents, otherEvents, move)
}
