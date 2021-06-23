const { isEmpty, map, sortBy } = require('lodash')

const presenters = require('../../../../../common/presenters')

function setWarnings(req, res, next) {
  const { profile = {}, id: moveId } = req.move || {}
  const assessmentAnswers = profile.assessment_answers || []
  const personEscortRecord = profile.person_escort_record
  const youthRiskAssessment = profile.youth_risk_assessment
  const requiresYouthRiskAssessment = profile.requires_youth_risk_assessment

  const assessment = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key !== 'court')
    .map(presenters.assessmentCategoryToPanelComponent)

  const youthAssessmentSections = map(
    youthRiskAssessment?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: `/move/${moveId}/youth-risk-assessment`,
    })
  )
  const perAssessmentSections = map(
    personEscortRecord?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: `/move/${moveId}/person-escort-record`,
    })
  )

  const assessmentSections =
    !isEmpty(personEscortRecord) || !requiresYouthRiskAssessment
      ? sortBy(perAssessmentSections, 'order')
      : sortBy(youthAssessmentSections, 'order')

  let tagList
  const personEscortRecordIsCompleted =
    !isEmpty(personEscortRecord) &&
    !['not_started', 'in_progress'].includes(personEscortRecord.status)

  if (personEscortRecordIsCompleted) {
    tagList = presenters.frameworkFlagsToTagList({
      flags: personEscortRecord.flags,
      hrefPrefix: req.originalUrl,
      includeLink: true,
    })
  }

  res.locals.warnings = {
    sections:
      !isEmpty(assessmentSections) || requiresYouthRiskAssessment
        ? assessmentSections
        : assessment,
    tagList,
  }

  next()
}

module.exports = setWarnings
