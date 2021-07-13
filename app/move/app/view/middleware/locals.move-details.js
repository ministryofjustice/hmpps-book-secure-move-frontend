const moveHelpers = require('../../../../../common/helpers/move')
const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { canAccess, move } = req
  const updateUrls = moveHelpers.getUpdateUrls(move, canAccess)

  const moveDetails = presenters.moveToMetaListComponent(move, {
    showPerson: false,
    updateUrls,
  })

  res.locals.moveDetails = moveDetails

  next()
}

module.exports = localsMoveDetails
