const { cloneDeep } = require('lodash')

const commonPrisonCategory = require('./prisoner-common-category')

const prisonerCategory = {
  ...cloneDeep(commonPrisonCategory),
  id: 'prisoner_adult_female',
  name: 'prisoner_adult_female',
  validate: 'required',
  component: 'govukRadios',
  label: {
    text: 'fields::prisoner_adult_female.select_label',
  },
}

module.exports = prisonerCategory
