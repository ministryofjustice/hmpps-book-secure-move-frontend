const { isEmpty, map, sortBy } = require('lodash')

const presenters = require('../../../../../common/presenters')

function setWarnings(req, res, next) {
  const { profile, id: moveId } = req.move || {}

  if (!profile) {
    return next()
  }

  let tagList, importantEventsTagList
  const personEscortRecord = profile.person_escort_record
  const perAssessmentSections = map(
    personEscortRecord?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: `/move/${moveId}/person-escort-record`,
    })
  )
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord.status)

  if (personEscortRecordIsCompleted) {
    tagList = presenters.frameworkFlagsToTagList({
      flags: personEscortRecord.flags,
      hrefPrefix: req.originalUrl,
      includeLink: true,
    })
    importantEventsTagList = presenters.moveToImportantEventsTagListComponent(
      req.move,
      true
    )
  }

  res.locals.warnings = {
    sections: personEscortRecord
      ? sortBy(perAssessmentSections, 'order')
      : undefined,
    tagList,
    importantEventsTagList,
  }

  next()
}

module.exports = setWarnings
