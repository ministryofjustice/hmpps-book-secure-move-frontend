const filters = require('../../../../../config/nunjucks/filters')
const formatSummary = moveOrJourney => ({
  context: moveOrJourney.status,
  date: filters.formatDate(moveOrJourney.date),
  fromLocation: moveOrJourney.from_location?.title,
  toLocation: moveOrJourney.to_location?.title,
})
const formatMoveLockOutSummary = move => [
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

function identityBarJourneys(req, res, next) {
  const { move, journeys } = req

  if (!move || !journeys) {
    return next()
  }

  const hasJourneysOnDifferentDay =
    journeys.filter(({ date }) => date !== move.date).length !== 0

  if (hasJourneysOnDifferentDay) {
    res.locals.identityBar.journeys = journeys.map(journey =>
      formatSummary(journey)
    )
  } else if (move.is_lockout) {
    res.locals.identityBar.journeys = formatMoveLockOutSummary(move)
  } else {
    res.locals.identityBar.journeys = [formatSummary(move)]
  }

  delete res.locals.identityBar.summary
  next()
}

module.exports = identityBarJourneys
