const cancellationReason = require('./cancellation_reason')
const cancellationReasonComment = require('./cancellation_reason_comment')
const completeInFull = require('./complete_in_full')
const complexCases = require('./complex-cases')
const allocationDate = require('./date')
const estate = require('./estate')
const estateOther = require('./estate_other')
const fromLocation = require('./from-location')
const hasOtherCriteria = require('./has-other-criteria')
const movesCount = require('./moves-count')
const otherCriteria = require('./other-criteria')
const prisonerMaleCategory = require('./prisoner-male-category')
const prisonerOtherCategory = require('./prisoner-other-category')
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
  prisoner_male_category: prisonerMaleCategory,
  prisoner_female_category: prisonerOtherCategory,
  prisoner_youth_female_category: prisonerOtherCategory,
  prisoner_youth_male_category: prisonerOtherCategory,
  sentence_length: sentenceLength,
  to_location: toLocation,
  estate,
  estate_other: estateOther,
  sentence_length_comment: sentenceLengthComment,
}

const cancelFields = {
  cancellation_reason: cancellationReason,
  cancellation_reason_comment: cancellationReasonComment,
}

module.exports = {
  cancelFields,
  createFields,
}
