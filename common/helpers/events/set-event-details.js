const eventDetailsHelpers = require('./event-details-helpers')

/**
 * Update event details to contain all relevant properties and relationships
 *
 * @param {*} event
 * @param {*} move
 * @returns [{object}]
 * {
 *   move,
 *   person
 *   agency
 *   context
 *   ...relationships
 *   [eventable]
 *   notes
 *   occurred_at
 *   ...details
 * }
 */
const setEventDetails = (event, move) => {
  return {
    ...event,
    details: {
      ...eventDetailsHelpers.getMoveDetails(move),
      ...eventDetailsHelpers.getEventAgency(event),
      ...eventDetailsHelpers.getEventContext(event),
      ...eventDetailsHelpers.getEventRelationships(event),
      ...eventDetailsHelpers.getEventableDetails(event),
      ...eventDetailsHelpers.getEventProperties(event),
      ...event.details,
    },
  }
}

module.exports = setEventDetails
