const eventToTagComponent = require('./event-to-tag-component')

const moveToImportantEventsTagListComponent = (move = {}) => {
  const { important_events: importantEvents = [] } = move
  return importantEvents.map(event => eventToTagComponent(event, move.id))
}

module.exports = moveToImportantEventsTagListComponent
