const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { move } = req
  let MoveLodgingEnded

  const moveDetails = presenters.moveToMetaListComponent(move)

  res.locals.moveDetails = moveDetails
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveId = move.id

  move.important_events.forEach(event => {
    if (event.event_type === 'MoveLodgingEnd') {
      return (MoveLodgingEnded = true)
    }
  })

  res.locals.MoveLodgingEnded = MoveLodgingEnded

  next()
}

module.exports = localsMoveDetails
