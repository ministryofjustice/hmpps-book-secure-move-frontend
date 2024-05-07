// Using get because testcafe barfs on optional chaining
import { get } from 'lodash'

import i18n from '../../../../config/i18n'
import { hasOvernightLodge } from '../../../helpers/move/has-overnight-lodge'
import { GenericEvent } from '../../../types/generic_event'
import { Move } from '../../../types/move'

const setMissingToLocation = (move: Move) => {
  if (!move.to_location) {
    const typeKey = ['prison_recall', 'video_remand'].includes(move.move_type)
      ? move.move_type
      : 'unknown'

    move.to_location = {
      id: 'unknown',
      key: `unknown__${move.move_type}`,
      title: i18n.t(`fields::move_type.items.${typeKey}.label`),
      location_type: 'prison',
      type: 'locations',
      extradition_capable: false,
    }
  }
}

const setVehicleRegistration = (move: Move) => {
  move._vehicleRegistration =
    get(move, 'meta.vehicle_registration') || undefined
}

const setExpectedTime = (move: Move) => {
  move._expectedCollectionTime =
    get(move, 'meta.expected_collection_time') || undefined
  move._expectedArrivalTime =
    get(move, 'meta.expected_time_of_arrival') || undefined
}

const setExtraStates = (move: Move) => {
  move._hasLeftCustody = ['in_transit', 'completed'].includes(move.status)
  move._hasArrived = ['completed'].includes(move.status)
}

const addImportantEvents = (move: Move) => {
  // timeline_events and important_events are mutually exclusive at the BE
  // copy any event with a non-default classification to .important_events
  // maintaining the same order
  if (
    !get(move, 'important_events.length') &&
    get(move, 'timeline_events.length')
  ) {
    move.important_events = move.timeline_events?.filter(
      ({ event_type: eventType, classification }) =>
        eventType === 'PerPropertyChange' ||
        eventType === 'PerHandover' ||
        eventType === 'MoveLodgingStart' ||
        eventType === 'MoveLodgingEnd' ||
        (classification && classification !== 'default')
    )
  }
}

const getCountEventType = (event: GenericEvent): string => {
  if (
    ['MoveLodgingStart', 'MoveLodgingEnd'].includes(event.event_type || '') &&
    ['lockout', 'overnight_lodging'].includes(event.details?.reason || '')
  ) {
    return `${event.event_type}:${event.details?.reason}`
  }

  return event.event_type || ''
}

const addEventCountToEvents = (move: Move) => {
  // Add _eventCount to important_events
  if (move.important_events) {
    const eventTypes: { [type: string]: number } = {}
    move.important_events.forEach(event => {
      const eventType = getCountEventType(event)

      eventTypes[eventType] = eventTypes[eventType] || 0
      eventTypes[eventType]++
    })
    const multiEventTypes = Object.keys(eventTypes).filter(
      key => eventTypes[key] > 1
    )

    multiEventTypes.forEach(multiEventType => {
      ;(move.important_events as GenericEvent[])
        .filter(event => getCountEventType(event) === multiEventType)
        .forEach((event, index) => {
          event._index = index + 1
        })
    })
  }
}

const addReasonToMoveLodgingEndEvents = (move: Move) => {
  if (move.timeline_events) {
    let lastLodgingStartEvent: GenericEvent

    move.timeline_events.forEach(event => {
      if (event.event_type === 'MoveLodgingStart') {
        lastLodgingStartEvent = event
      } else if (
        event.event_type === 'MoveLodgingEnd' &&
        lastLodgingStartEvent
      ) {
        if (!event.details) {
          event.details = {}
        }

        event.details.reason = lastLodgingStartEvent.details?.reason
      }
    })
  }
}

const setIsLodging = (move: Move) => {
  move.is_lodging = hasOvernightLodge(move)
}

export function moveTransformer(move: Move) {
  addImportantEvents(move)
  addReasonToMoveLodgingEndEvents(move)
  addEventCountToEvents(move)
  setMissingToLocation(move)
  setVehicleRegistration(move)
  setExpectedTime(move)
  setExtraStates(move)
  setIsLodging(move)
}
