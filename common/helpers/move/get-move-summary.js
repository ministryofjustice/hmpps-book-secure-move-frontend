const moveToMetaListComponent = require('../../presenters/move-to-meta-list-component')
const personToMetaListComponent = require('../../presenters/person-to-meta-list-component')

function getMoveSummary(move, opts) {
  if (!move) {
    return {}
  }

  const moveSummary = moveToMetaListComponent(move, opts)
  // `move.person` caters for sessionData within form wizard journeys
  const person = move.person || move?.profile?.person
  const personMetaList = personToMetaListComponent(person)

  const locals = {
    moveSummary,
    personSummary: {
      metaList: personMetaList,
      image: person?._image_url
        ? {
            url: person._image_url,
            alt: person._fullname,
          }
        : undefined,
      // TODO: Uncomment below when we release the profile link everywhere
      // profileLink: person?.id ? `/person/${person.id}` : undefined,
    },
  }

  return locals
}

module.exports = getMoveSummary
