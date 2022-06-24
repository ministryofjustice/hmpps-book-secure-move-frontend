const moveHelpers = require('../../../common/helpers/move')
const presenters = require('../../../common/presenters')

module.exports = async (req, res) => {
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    req.person
  )
  const moveId = req.query?.move

  const move = await req.services.move.getById(moveId)
  const updateUrls = moveHelpers.getUpdateUrls(move, req.canAccess)

  res.render('person/views/personal-details', {
    personalDetailsSummary,
    moveId,
    updateLink: updateUrls.personal_details,
  })
}
