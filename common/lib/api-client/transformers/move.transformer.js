const { get } = require('lodash')

const setIsYouthMove = data => {
  const fromLocationType = get(data, 'from_location.location_type')
  const isYouthMove = [
    'secure_training_centre',
    'secure_childrens_home',
  ].includes(fromLocationType)

  data._is_youth_move = isYouthMove
}

const addImportantEvents = data => {
  // timeline_events and important_events are mutually exclusive at the BE
  // copy any event with a non-default classification to .important_events
  // maintaining the same order
  if (!data.important_events?.length && data.timeline_events?.length) {
    data.important_events = data.timeline_events.filter(
      ({ classification }) => classification && classification !== 'default'
    )
  }
}

const addEventCountToEvents = data => {
  // Add _eventCount to important_events
  if (data.important_events) {
    const eventTypes = {}
    data.important_events.forEach(event => {
      const { event_type: eventType } = event
      eventTypes[eventType] = eventTypes[eventType] || 0
      eventTypes[eventType]++
    })
    const multiEventTypes = Object.keys(eventTypes).filter(
      key => eventTypes[key] > 1
    )

    multiEventTypes.forEach(eventType => {
      data.important_events
        .filter(event => event.event_type === eventType)
        .forEach((event, index) => {
          event._eventCount = index + 1
        })
    })
  }
}

module.exports = function moveTransformer(data) {
  setIsYouthMove(data)
  addImportantEvents(data)
  addEventCountToEvents(data)
}
