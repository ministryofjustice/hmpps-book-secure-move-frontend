const addTriggeredEvents = require('../../common/helpers/events/add-triggered-events')

const eventToTimelineItemComponent = require('./event-to-timeline-item-component')

const moveToTimelineComponent = (move = {}) => {
  const { timeline_events: timelineEvents = [] } = move
  addTriggeredEvents(timelineEvents)

  const items = timelineEvents
    .map(moveEvent => eventToTimelineItemComponent(moveEvent, move))
    .reverse()
  return { items }
}

module.exports = moveToTimelineComponent
