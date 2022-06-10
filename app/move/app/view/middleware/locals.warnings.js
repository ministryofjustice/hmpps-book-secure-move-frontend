const { isEmpty, map, sortBy, get } = require('lodash')

const presenters = require('../../../../../common/presenters')

async function setWarnings(req, res, next) {
  const {
    profile,
    id: moveId,
    important_events: importantEvents,
  } = req.move || {}

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

  const sections = personEscortRecord
    ? sortBy(perAssessmentSections, 'order')
    : []

  if (importantEvents?.length) {
    sections.unshift(
      await presenters.moveToInTransitEventsPanelList(
        get(req.session, 'grant.response.access_token'),
        req.move
      )
    )
  }

  res.locals.warnings = {
    sections,
    tagList,
    importantEventsTagList,
  }

  next()
}

module.exports = setWarnings
