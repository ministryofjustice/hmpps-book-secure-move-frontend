const { isEmpty } = require('lodash')

const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getPerDetails(move, canAccess) {
  const { profile } = move
  const { person_escort_record: personEscortRecord } = profile || {}

  const moveUrl = getMoveUrl(move.id)

  const personEscortRecordIsEnabled = canAccess('person_escort_record:view')
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord?.status)
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList({
    flags: personEscortRecord?.flags,
    hrefPrefix: moveUrl,
    includeLink: true,
  })

  const perDetails = {
    personEscortRecord,
    personEscortRecordIsEnabled,
    personEscortRecordIsCompleted,
    personEscortRecordTagList,
  }

  return perDetails
}

module.exports = getPerDetails
