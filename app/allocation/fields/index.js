const cancellationReason = require('./cancellation_reason')
const cancellationReasonOtherComment = require('./cancellation_reason_other_comment')
const completeInFull = require('./complete_in_full')
const complexCases = require('./complex-cases')
const allocationDate = require('./date')
const estate = require('./estate')
const estateComment = require('./estate_comment')
const fromLocation = require('./from-location')
const hasOtherCriteria = require('./has-other-criteria')
const movesCount = require('./moves-count')
const otherCriteria = require('./other-criteria')
const prisonerAdultFemale = require('./prisoner-adult-female')
const prisonerAdultMale = require('./prisoner-adult-male')
const prisonerYoungOffenderFemale = require('./prisoner-young-offender-female')
const prisonerYoungOffernderMale = require('./prisoner-young-offender-male')
const sentenceLength = require('./sentence-length')
const sentenceLengthComment = require('./sentence-length-comment')
const toLocation = require('./to-location')

const createFields = {
  date: allocationDate,
  complex_cases: complexCases,
  from_location: fromLocation,
  complete_in_full: completeInFull,
  moves_count: movesCount,
  has_other_criteria: hasOtherCriteria,
  other_criteria: otherCriteria,
  prisoner_adult_male: prisonerAdultMale,
  prisoner_adult_female: prisonerAdultFemale,
  prisoner_young_offender_male: prisonerYoungOffernderMale,
  prisoner_young_offender_female: prisonerYoungOffenderFemale,
  sentence_length: sentenceLength,
  to_location: toLocation,
  estate,
  estate_comment: estateComment,
  sentence_length_comment: sentenceLengthComment,
}

const cancelFields = {
  cancellation_reason: cancellationReason,
  cancellation_reason_other_comment: cancellationReasonOtherComment,
}

const editFields = {
  date: allocationDate,
}

module.exports = {
  cancelFields,
  createFields,
  editFields,
}
