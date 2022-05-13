const eventToTagComponent = require('./event-to-tag-component')

const EXCLUDED_EVENTS = ['PerHandover', 'MoveLodgingStart', 'MoveLodgingEnd']

const moveToImportantEventsTagListComponent = (
  move = {},
  linkToLocal = false
) => {
  const { important_events: importantEvents = [] } = move

  return importantEvents
    .filter(({ event_type: eventType }) => !EXCLUDED_EVENTS.includes(eventType))
    .map(event => eventToTagComponent(event, move.id, linkToLocal))
}

module.exports = moveToImportantEventsTagListComponent
