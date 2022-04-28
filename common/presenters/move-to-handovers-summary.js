const formatRecordedHandover = (moveOrJourney, event) => ({
  recorded: true,
  event: event.id,
  location: event.location?.title || moveOrJourney.from_location.title,
})

const formatAwaitingHandover = location => ({
  recorded: false,
  location: location.title,
})

const findPerHandoverEvents = (move, journey, events) =>
  events.filter(({ location }) => {
    if (move.from_location.id === journey.from_location.id) {
      return !location || location.id === move.from_location.id
    } else {
      return location?.id === journey.from_location.id
    }
  })

module.exports = (move, journeys) => {
  const filteredJourneys = journeys.filter(
    ({ state }) => state !== 'rejected' && state !== 'cancelled'
  )

  const perHandoverEvents = (move.important_events || []).filter(
    ({ event_type: eventType }) => eventType === 'PerHandover'
  )

  if (['proposed', 'requested', 'booked'].includes(move.status)) {
    return perHandoverEvents.map(event => formatRecordedHandover(move, event))
  }

  return filteredJourneys.flatMap(journey => {
    const events = findPerHandoverEvents(move, journey, perHandoverEvents)

    if (events.length) {
      return events.map(event => formatRecordedHandover(journey, event))
    } else {
      return [formatAwaitingHandover(journey.from_location)]
    }
  })
}
