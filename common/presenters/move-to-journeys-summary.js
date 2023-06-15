const filters = require('../../config/nunjucks/filters')

const presentMoveOrJourney = (moveOrJourney, formatDate) => ({
  context: moveOrJourney.status,
  date: formatDate(moveOrJourney.date),
  fromLocation: moveOrJourney.from_location?.title,
  toLocation: moveOrJourney.to_location?.title,
})

const presentLockout = (move, formatDate) => [
  {
    fromLocation: move.from_location?.title,
    toLocation: '(awaiting destination)',
    date: formatDate(move.date),
  },
  {
    fromLocation: '(awaiting location)',
    toLocation: move.to_location?.title,
    date: '(awaiting date)',
  },
]

module.exports = (move, journeys, { formatDate = filters.formatDate } = {}) => {
  const filteredJourneys = journeys.filter(
    ({ state }) => state !== 'rejected' && state !== 'cancelled'
  )

  const hasJourneysOnDifferentDay =
    filteredJourneys.filter(({ date }) => date !== move.date).length !== 0

  const overnightLodges =
    move.timeline_events
      ?.filter(e => e.event_type === 'MoveOvernightLodge')
      .sort((a, b) =>
        (b.details.end_date || '') > (a.details.end_date || '') ? -1 : 1
      ) || []

  if (!hasJourneysOnDifferentDay && !overnightLodges.length) {
    if (move.is_lockout) {
      return presentLockout(move, formatDate)
    }

    return [presentMoveOrJourney(move, formatDate)]
  }

  const journeysWithLodges = [...filteredJourneys]
  journeysWithLodges.push(
    ...overnightLodges
      .map((lodge, i) => {
        const from =
          i > 0 ? overnightLodges[i - 1].location : move.from_location

        return {
          date: lodge.details.start_date,
          status: 'proposed',
          from_location: from,
          to_location: lodge.location,
          lodge,
        }
      })
      .filter((lodge, i) => {
        // filter out any lodges that have journeys, to avoid duplication
        return !filteredJourneys.find(
          journey =>
            journey.from_location.id === lodge.from_location.id &&
            journey.to_location.id === lodge.to_location.id
        )
      })
  )

  // order by date, then by creation order
  journeysWithLodges.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const lastJourney = journeysWithLodges[journeysWithLodges.length - 1]

  // if the last journey is a lodge, we need to add a fake journey from that
  //   lodge to complete the move
  if (lastJourney.lodge) {
    journeysWithLodges.push({
      date: lastJourney.lodge.details.end_date,
      status: 'proposed',
      from_location: lastJourney.lodge.location,
      to_location: move.to_location,
    })
  }

  return journeysWithLodges.map(journey =>
    presentMoveOrJourney(journey, formatDate)
  )
}
