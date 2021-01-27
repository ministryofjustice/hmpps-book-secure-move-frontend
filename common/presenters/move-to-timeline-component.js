const eventToTimelineItemComponent = require('./event-to-timeline-item-component')

const moveToTimelineComponent = (move = {}) => {
  const { timeline_events: timelineEvents = [] } = move

  const items = timelineEvents
    .map(moveEvent => eventToTimelineItemComponent(moveEvent, move))
    .reverse()
  return { items }
}

module.exports = moveToTimelineComponent
