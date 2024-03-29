const formatRecordedHandover = (moveOrJourney, event) => ({
  recorded: true,
  event: event.id,
  location: event.location?.title || moveOrJourney.from_location.title,
})

const formatAwaitingHandover = location => ({
  recorded: false,
  location: location.title,
})

const findPerHandoverEvents = (move, journey, events) => {
  const perHandoverEvents = (events || []).filter(
    ({ event_type: eventType }) => eventType === 'PerHandover'
  )

  if (!journey) {
    return perHandoverEvents
  }

  return perHandoverEvents.filter(({ location, occurred_at: occurredAt }) => {
    if (new Date(occurredAt.split('T')[0]) < new Date(journey.date)) {
      return false
    }

    if (!location) {
      return move.from_location.id === journey.from_location.id
    }

    return location.id === journey.from_location.id
  })
}

module.exports = (move, journeys, includeProposed) => {
  const filteredJourneys = journeys.filter(
    ({ state }) =>
      state !== 'rejected' &&
      state !== 'cancelled' &&
      (includeProposed || state !== 'proposed')
  )

  if (['proposed', 'requested', 'booked'].includes(move.status)) {
    return findPerHandoverEvents(move, null, move.important_events).map(event =>
      formatRecordedHandover(move, event)
    )
  }

  const handovers = []

  filteredJourneys.reverse().forEach(journey => {
    const handoverEvent = findPerHandoverEvents(
      move,
      journey,
      move.important_events
    )
      .reverse()
      .find(event => {
        return !handovers.find(handover => handover.event === event.id)
      })

    if (handoverEvent) {
      handovers.unshift(formatRecordedHandover(journey, handoverEvent))
    } else {
      handovers.unshift(formatAwaitingHandover(journey.from_location))
    }
  })

  return handovers
}
