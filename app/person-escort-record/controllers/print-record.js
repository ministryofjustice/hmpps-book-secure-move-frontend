const { filter, find, orderBy, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')
const i18n = require('../../../config/i18n').default
const filters = require('../../../config/nunjucks/filters')

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
  const { personEscortRecord = {}, move, journeys } = req
  const profile = move?.profile || personEscortRecord?.profile
  const reference = move?.reference
  const framework = personEscortRecord?._framework
  const moveId = move?.id
  const pickupLocation = move?.from_location?.title
  const moveType = move?.move_type
  const fullname = profile?.person?._fullname
  const imageUrl = profile?.person?._image_url
  const moveSummary = presenters.moveToSummaryListComponent(move, journeys)
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
        summaryList:
          presenters.courtHearingToSummaryListComponent(courtHearing),
      }
    }
  )
  const personEscortRecordSections = orderBy(
    personEscortRecord.sections,
    'order'
  ).map(section => {
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
  })
  const personEscortRecordTagList = presenters.frameworkFlagsToTagList({
    flags: personEscortRecord?.flags,
  })
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
  const handoverDetails = {
    ...personEscortRecord.handover_details,
    occurred_at: personEscortRecord.handover_occurred_at,
  }
  const timestampKey = personEscortRecord.amended_at
    ? 'amended_at'
    : 'completed_at'
  const timestamp = i18n.t(timestampKey, {
    date: filters.formatDateWithTimeAndDay(
      personEscortRecord[timestampKey],
      true
    ),
  })

  const locals = {
    moveId,
    moveType,
    pickupLocation,
    imageUrl,
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
    timestamp,
    handoverDetails,
  }

  res.render('person-escort-record/views/print-record', locals)
}

module.exports = printRecord
