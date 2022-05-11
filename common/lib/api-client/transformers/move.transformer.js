const { get } = require('lodash')
// Using get because testcafe barfs on optional chaining

const i18n = require('../../../../config/i18n')

const setMissingToLocation = data => {
  if (!data.to_location) {
    const typeKey = ['prison_recall', 'video_remand'].includes(data.move_type)
      ? data.move_type
      : 'unknown'

    data.to_location = {
      key: `unknown__${data.move_type}`,
      title: i18n.t(`fields::move_type.items.${typeKey}.label`),
    }
  }
}

const setVehicleRegistration = data => {
  data._vehicleRegistration =
    get(data, 'meta.vehicle_registration') || undefined
}

const setExpectedTime = data => {
  data._expectedCollectionTime =
    get(data, 'meta.expected_collection_time') || undefined
  data._expectedArrivalTime =
    get(data, 'meta.expected_time_of_arrival') || undefined
}

const setExtraStates = data => {
  data._hasLeftCustody = ['in_transit', 'completed'].includes(data.status)
  data._hasArrived = ['completed'].includes(data.status)
}

const addImportantEvents = data => {
  // timeline_events and important_events are mutually exclusive at the BE
  // copy any event with a non-default classification to .important_events
  // maintaining the same order
  if (
    !get(data, 'important_events.length') &&
    get(data, 'timeline_events.length')
  ) {
    data.important_events = data.timeline_events.filter(
      ({ event_type: eventType, classification }) =>
        eventType === 'PerPropertyChange' ||
        eventType === 'PerHandover' ||
        eventType === 'MoveLodgingStart' ||
        eventType === 'MoveLodgingEnd' ||
        (classification && classification !== 'default')
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
          event._index = index + 1
        })
    })
  }
}

module.exports = function moveTransformer(data) {
  addImportantEvents(data)
  addEventCountToEvents(data)
  setMissingToLocation(data)
  setVehicleRegistration(data)
  setExpectedTime(data)
  setExtraStates(data)
}
