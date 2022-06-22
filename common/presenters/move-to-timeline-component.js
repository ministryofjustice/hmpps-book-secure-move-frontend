const eventToTimelineItemComponent = require('./event-to-timeline-item-component')

const moveToTimelineComponent = async (token, move = {}) => {
  const { timeline_events: timelineEvents = [] } = move

  const items = (
    await Promise.all(
      timelineEvents.map(moveEvent =>
        eventToTimelineItemComponent(token, moveEvent, move)
      )
    )
  ).reverse()
  return { items }
}

module.exports = moveToTimelineComponent
