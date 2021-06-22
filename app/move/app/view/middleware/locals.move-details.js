const presenters = require('../../../../../common/presenters')
const editSteps = require('../../edit/steps')

async function localsMoveDetails(req, res, next) {
  const { canAccess, move } = req

  const moveDetails = presenters.moveToMetaListComponent(
    move,
    canAccess,
    editSteps,
    false
  )

  res.locals.moveDetails = moveDetails

  next()
}

module.exports = localsMoveDetails
