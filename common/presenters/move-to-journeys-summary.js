const filters = require('../../config/nunjucks/filters')

const presentMoveOrJourney = moveOrJourney => ({
  context: moveOrJourney.status,
  date: filters.formatDate(moveOrJourney.date),
  fromLocation: moveOrJourney.from_location?.title,
  toLocation: moveOrJourney.to_location?.title,
})

const presentLockout = move => [
  {
    fromLocation: move.from_location?.title,
    toLocation: '(awaiting destination)',
    date: filters.formatDate(move.date),
  },
  {
    fromLocation: '(awaiting location)',
    toLocation: move.to_location?.title,
    date: '(awaiting date)',
  },
]

module.exports = (move, journeys) => {
  const hasJourneysOnDifferentDay =
    journeys.filter(({ date }) => date !== move.date).length !== 0

  if (hasJourneysOnDifferentDay) {
    return journeys.map(journey => presentMoveOrJourney(journey))
  } else if (move.is_lockout) {
    return presentLockout(move)
  } else {
    return [presentMoveOrJourney(move)]
  }
}
