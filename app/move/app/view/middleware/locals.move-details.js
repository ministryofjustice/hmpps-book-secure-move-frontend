const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { journeys, move } = req

  const moveDetails = presenters.moveToMetaListComponent(move, journeys)

  res.locals.moveDetails = moveDetails
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveId = move.id

  res.locals.moveLodgingStarted = move.important_events.some(
    ({ event_type: eventType }) => eventType === 'MoveLodgingStart'
  )
  res.locals.moveLodgingEnded = move.important_events.some(
    ({ event_type: eventType }) => eventType === 'MoveLodgingEnd'
  )

  next()
}

module.exports = localsMoveDetails
