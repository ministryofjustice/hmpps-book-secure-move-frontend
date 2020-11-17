const i18n = require('../../../config/i18n')

// Add any faux events triggered by other events
const addTriggeredEvents = moveEvents => {
  moveEvents = [...moveEvents]
  const eventsWithTriggers = moveEvents.filter(event => {
    return i18n.exists(`events::${event.event_type}.triggers`)
  })
  eventsWithTriggers.forEach(event => {
    const eventIndex = moveEvents.indexOf(event)
    moveEvents.splice(eventIndex + 1, 0, {
      ...event,
      event_type: i18n.t(`events::${event.event_type}.triggers`),
    })
  })
  return moveEvents
}

module.exports = addTriggeredEvents
