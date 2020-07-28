const { cloneDeep } = require('lodash')

const commonPrisonCategory = require('./prisoner-common-category')

const prisonerCategory = {
  ...cloneDeep(commonPrisonCategory),
  id: 'prisoner_young_offender_female',
  name: 'prisoner_young_offender_female',
  validate: 'required',
  component: 'govukRadios',
  label: {
    text: 'fields::prisoner_young_offender_female.select_label',
  },
}

module.exports = prisonerCategory
