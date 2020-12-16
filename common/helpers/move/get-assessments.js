const { find, map, sortBy } = require('lodash')

const { FEATURE_FLAGS } = require('../../../config')
const presenters = require('../../presenters')

const getMoveUrl = require('./get-move-url')

function getAssessments(move) {
  const { profile, id: moveId } = move
  const {
    assessment_answers: assessmentAnswers = [],
    person_escort_record: personEscortRecord,
    youth_risk_assessment: youthRiskAssessment,
    requires_youth_risk_assessment: requiresYouthRiskAssessment,
  } = profile || {}

  const assessment = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key !== 'court')
    .map(presenters.assessmentCategoryToPanelComponent)
  const courtSummary = presenters
    .assessmentAnswersByCategory(assessmentAnswers)
    .filter(category => category.key === 'court')
    .map(presenters.assessmentCategoryToSummaryListComponent)[0]
  const youthAssessmentSections = map(
    youthRiskAssessment?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: getMoveUrl(moveId, 'youth-risk-assessment'),
    })
  )
  const perAssessmentSections = map(
    personEscortRecord?._framework?.sections,
    presenters.frameworkSectionToPanelList({
      baseUrl: getMoveUrl(moveId, 'person-escort-record'),
    })
  ).map(section => {
    return {
      ...section,
      previousAssessment:
        requiresYouthRiskAssessment &&
        youthRiskAssessment &&
        FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT
          ? find(youthAssessmentSections, { key: section.key })
          : find(assessment, { frameworksSection: section.key }),
    }
  })
  const combinedSections = perAssessmentSections.reduce((acc, section) => {
    const key = section.previousAssessment?.key

    if (key) {
      acc.push(key)
    }

    return acc
  }, [])
  const combinedAssessmentSections = [
    ...perAssessmentSections,
    ...youthAssessmentSections.filter(
      section =>
        FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT &&
        !combinedSections.includes(section.key)
    ),
  ]

  const assessmentSections =
    personEscortRecord || !requiresYouthRiskAssessment
      ? sortBy(combinedAssessmentSections, 'order')
      : sortBy(youthAssessmentSections, 'order')

  const assessments = {
    assessment,
    courtSummary,
    youthRiskAssessment,
    youthRiskAssessmentIsEnabled: FEATURE_FLAGS.YOUTH_RISK_ASSESSMENT,
    assessmentSections,
  }

  return assessments
}

module.exports = getAssessments
