const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { move } = req

  const moveDetails = presenters.moveToMetaListComponent(move)

  res.locals.moveDetails = moveDetails
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveId = move.id

  next()
}

module.exports = localsMoveDetails
