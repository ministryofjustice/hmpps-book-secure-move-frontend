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
  const hasJourneysOnDifferentDay =
    journeys.filter(({ date }) => date !== move.date).length !== 0

  if (hasJourneysOnDifferentDay) {
    return journeys.map(journey => presentMoveOrJourney(journey, formatDate))
  } else if (move.is_lockout) {
    return presentLockout(move, formatDate)
  } else {
    return [presentMoveOrJourney(move, formatDate)]
  }
}
