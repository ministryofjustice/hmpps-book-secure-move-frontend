const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { move } = req

  const moveDetails = presenters.moveToMetaListComponent(move)

  res.locals.moveDetails = moveDetails

  next()
}

module.exports = localsMoveDetails
