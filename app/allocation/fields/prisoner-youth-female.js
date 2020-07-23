const { cloneDeep } = require('lodash')

const commonPrisonCategory = require('./prisoner-common-category')

const prisonerCategory = {
  ...cloneDeep(commonPrisonCategory),
  id: 'prisoner_youth_female',
  name: 'prisoner_youth_female',
  validate: 'required',
  component: 'govukRadios',
  label: {
    text: 'fields::prisoner_youth_female.select_label',
  },
}

module.exports = prisonerCategory
