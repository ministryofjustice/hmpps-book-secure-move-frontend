const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { move } = req
  let moveLodgingStarted
  let moveLodgingEnded

  const moveDetails = presenters.moveToMetaListComponent(move)

  res.locals.moveDetails = moveDetails
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveId = move.id

  move.important_events.forEach(event => {
    if (event.event_type === 'MoveLodgingStart') {
      return (moveLodgingStarted = true)((moveLodgingEnded = false))
    } else if (event.event_type === 'MoveLodgingEnd') {
      return (moveLodgingStarted = false)((moveLodgingEnded = true))
    }
  })

  res.locals.moveLodgingEnded = moveLodgingStarted
  res.locals.moveLodgingEnded = moveLodgingEnded

  next()
}

module.exports = localsMoveDetails
