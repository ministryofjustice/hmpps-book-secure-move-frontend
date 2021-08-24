const presenters = require('../../../../../common/presenters')

function localsMoveDetails(req, res, next) {
  const profile = req.move?.profile

  if (!profile) {
    return next()
  }

  const person = profile.person
  const metaList = presenters.personToMetaListComponent(person)

  res.locals.personSummary = {
    metaList,
    image: {
      url: person._image_url,
      alt: person._fullname,
    },
    profileLink: `/person/${person.id}`,
  }

  next()
}

module.exports = localsMoveDetails
