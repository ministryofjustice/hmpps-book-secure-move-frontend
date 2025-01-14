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
    personEscortRecord?.sections || [
      { name: 'Risk information', order: 1 },
      { name: 'Offence information', order: 2 },
      { name: 'Health information', order: 3 },
      { name: 'Property information', order: 4 },
    ],
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

  const sections = perAssessmentSections
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
