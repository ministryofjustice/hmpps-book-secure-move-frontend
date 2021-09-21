const eventToTagComponent = require('./event-to-tag-component')

const moveToImportantEventsTagListComponent = (
  move = {},
  linkToLocal = false
) => {
  const { important_events: importantEvents = [] } = move
  return importantEvents.map(event =>
    eventToTagComponent(event, move.id, linkToLocal)
  )
}

module.exports = moveToImportantEventsTagListComponent
