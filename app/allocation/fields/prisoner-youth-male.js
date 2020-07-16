const { cloneDeep } = require('lodash')

const commonPrisonCategory = require('./prisoner-common-category')

const prisonerCategory = {
  ...cloneDeep(commonPrisonCategory),
  id: 'prisoner_youth_male',
  name: 'prisoner_youth_male',
  validate: 'required',
  component: 'govukRadios',
  label: {
    text: 'fields::prisoner_youth_male.select_label',
  },
}

module.exports = prisonerCategory
