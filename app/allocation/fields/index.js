const { createFields: moveCreateFields } = require('../../move/fields')

const completeInFull = require('./complete_in_full')
const complexCases = require('./complex-cases')
const allocationDate = require('./date')
const fromLocation = require('./from-location')
const hasOtherCriteria = require('./has-other-criteria')
const movesCount = require('./moves-count')
const otherCriteria = require('./other-criteria')
const prisonerCategory = require('./prisoner-category')
const sentenceLength = require('./sentence-length')
const toLocation = require('./to-location')

const createFields = {
  date: allocationDate,
  complex_cases: complexCases,
  from_location: fromLocation,
  complete_in_full: completeInFull,
  moves_count: movesCount,
  has_other_criteria: hasOtherCriteria,
  other_criteria: otherCriteria,
  prisoner_category: prisonerCategory,
  sentence_length: sentenceLength,
  to_location: toLocation,
}

const assignFields = { ...moveCreateFields }

assignFields.special_vehicle_check = {
  validate: 'required',
  component: 'govukRadios',
  name: 'special_vehicle_check',
  fieldset: {
    legend: {
      text: 'fields::special_vehicle_check.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'true',
      text: 'fields::special_vehicle_check.items.yes.label',
    },
    {
      value: 'false',
      text: 'fields::special_vehicle_check.items.no.label',
    },
  ],
}

module.exports = {
  createFields,
  assignFields,
}
