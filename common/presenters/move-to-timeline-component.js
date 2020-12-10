const eventHelpers = require('../../common/helpers/events')

const eventToTimelineItemComponent = require('./event-to-timeline-item-component')

const moveToTimelineComponent = (move = {}) => {
  move.timeline_events = eventHelpers.addTriggeredEvents(move.timeline_events)
  const { timeline_events: timelineEvents = [] } = move

  const items = timelineEvents
    .map(moveEvent => eventToTimelineItemComponent(moveEvent, move))
    .reverse()
  return { items }
}

module.exports = moveToTimelineComponent
