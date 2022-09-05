const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { journeys, move } = req

  const moveDetails = presenters.moveToMetaListComponent(move, journeys)

  res.locals.moveDetails = moveDetails
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveId = move.id

  const importantEvents = move.important_events || []

  res.locals.moveLodgingStarted = importantEvents.some(
    ({ event_type: eventType }) => eventType === 'MoveLodgingStart'
  )
  res.locals.moveLodgingEnded = importantEvents.some(
    ({ event_type: eventType }) => eventType === 'MoveLodgingEnd'
  )

  const handovers = presenters.moveToHandoversSummary(move, journeys, true)

  if (move.is_lockout && handovers.length >= 2) {
    res.locals.moveLockoutHandover = handovers[handovers.length - 1]
  }

  next()
}

module.exports = localsMoveDetails
