const { filter, find, orderBy, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')

function _checkResponse({ responses = [], key, expectedValue }) {
  return (
    responses.filter(response => {
      if (response.question.key === key) {
        if (response.value_type === 'string') {
          return response.value === expectedValue
        }

        if (response.value_type.includes('object')) {
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
  const destination = move?.to_location?.title
  const moveType = move?.move_type
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
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList(
    personEscortRecord?.flags
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
  const propertyBags = find(personEscortRecord?.responses, [
    'question.key',
    'property-bags',
  ])
  const sealNumberQuestion = find(propertyBags?.question?.descendants, {
    key: 'property-bag-seal-number',
  })
  const propertyBagsQuestion = find(framework?.questions, {
    name: 'property-bags',
  })
  const sealNumberFrameworkQuestion = find(framework?.questions, {
    name: 'property-bag-seal-number',
  })
  const sealNumberDescription = sealNumberFrameworkQuestion?.question
  const propertyItemName = propertyBagsQuestion?.itemName
  const propertyToHandover = propertyBags?.value.map(item => {
    return item.responses
      .filter(
        response => response.framework_question_id === sealNumberQuestion.id
      )
      .map(response => response.value)
  })

  const locals = {
    moveId,
    moveType,
    destination,
    fullname,
    reference,
    moveSummary,
    courtSummary,
    courtHearings,
    isEscapeRisk,
    hasSelfHarmWarning,
    propertyToHandover,
    propertyItemName,
    sealNumberDescription,
    requiresMedicationDuringTransport,
    personalDetailsSummary,
    personEscortRecordSections,
    personEscortRecordTagList,
  }

  res.render('person-escort-record/views/print-record', locals)
}

module.exports = printRecord
