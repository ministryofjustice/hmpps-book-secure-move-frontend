const { filter, orderBy, sortBy } = require('lodash')

const presenters = require('../../../common/presenters')

function printRecord(req, res) {
  const { framework, personEscortRecord, move } = req
  const profile = move?.profile || personEscortRecord?.profile
  const reference = move?.reference
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

  const locals = {
    fullname,
    reference,
    moveSummary,
    courtSummary,
    courtHearings,
    personalDetailsSummary,
    personEscortRecordSections,
  }

  res.render('person-escort-record/views/print-record', locals)
}

module.exports = printRecord
