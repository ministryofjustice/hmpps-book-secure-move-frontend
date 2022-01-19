const moveHelpers = require('../../../../../common/helpers/move')
const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const { canAccess, move } = req

  const profile = move?.profile

  if (!profile) {
    return next()
  }

  const person = profile.person
  const metaList = presenters.personToMetaListComponent(person)
  const updateUrls = moveHelpers.getUpdateUrls(move, canAccess)

  res.locals.personSummary = {
    metaList,
    image: {
      url: person._image_url,
      alt: person._fullname,
    },
    profileLink: `/person/${person.id}?move=${req.move.id}`,
    updateLink: updateUrls.personal_details,
  }

  next()
}

module.exports = localsMoveDetails
