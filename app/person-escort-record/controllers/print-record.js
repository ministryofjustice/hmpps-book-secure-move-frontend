const { filter, orderBy, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')

function _checkResponse({ responses = [], key, expectedValue }) {
  return (
    responses.filter(response => {
      if (response.question.key === key) {
        if (response.value_type === 'string') {
          return response.value === expectedValue
        }

        if (response.value_type === 'object') {
          return response.value.option === expectedValue
        }
      }

      return false
    }).length > 0
  )
}

function printRecord(req, res) {
  const { framework, personEscortRecord, move } = req
  const profile = move?.profile || personEscortRecord?.profile
  const reference = move?.reference
  const moveId = move?.id
  const fullname = profile?.person?.fullname
  const moveSummary = presenters.moveToSummaryListComponent(move)
  const personalDetailsSummary = presenters.personToSummaryListComponent(
    profile?.person
  )
  const courtSummary = presenters
    .assessmentAnswersByCategory(profile?.assessment_answers)
    .filter(category => category.key === 'court')
    .map(presenters.assessmentCategoryToSummaryListComponent)[0]
  const courtHearings = sortBy(move?.court_hearings, 'start_time').map(
    courtHearing => {
      return {
        ...courtHearing,
        summaryList: presenters.courtHearingToSummaryListComponent(
          courtHearing
        ),
      }
    }
  )
  const personEscortRecordSections = orderBy(framework?.sections, 'order').map(
    section => {
      const { steps } = section
      const stepSummaries = Object.entries(steps).map(
        presenters.frameworkStepToSummary(
          framework.questions,
          personEscortRecord.responses
        )
      )

      return {
        ...section,
        summarySteps: filter(stepSummaries),
      }
    }
  )
  // TODO: Extract this logic to the framework
  // Checking for this value based on a key within the frontend is fragile
  // It could break if somebody simply renames a question key (filename) or option
  const hasSelfHarmWarning = _checkResponse({
    responses: personEscortRecord?.responses,
    key: 'indication-of-self-harm-or-suicide',
    expectedValue: 'Yes',
  })
  const requiresMedicationDuringTransport = _checkResponse({
    responses: personEscortRecord?.responses,
    key: 'medication-while-moving',
    expectedValue: 'Yes',
  })
  const isEscapeRisk = _checkResponse({
    responses: personEscortRecord?.responses,
    key: 'escape-risk',
    expectedValue: 'Yes',
  })

  const locals = {
    moveId,
    fullname,
    reference,
    moveSummary,
    courtSummary,
    courtHearings,
    isEscapeRisk,
    hasSelfHarmWarning,
    requiresMedicationDuringTransport,
    personalDetailsSummary,
    personEscortRecordSections,
  }

  res.render('person-escort-record/views/print-record', locals)
}

module.exports = printRecord
