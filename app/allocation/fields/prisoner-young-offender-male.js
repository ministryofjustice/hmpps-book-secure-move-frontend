const { cloneDeep } = require('lodash')

const commonPrisonCategory = require('./prisoner-common-category')

const prisonerCategory = {
  ...cloneDeep(commonPrisonCategory),
  id: 'prisoner_young_offender_male',
  name: 'prisoner_young_offender_male',
  validate: 'required',
  component: 'govukRadios',
  label: {
    text: 'fields::prisoner_young_offender_male.select_label',
  },
}

module.exports = prisonerCategory
