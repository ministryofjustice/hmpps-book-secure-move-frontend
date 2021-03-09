const { cloneDeep } = require('lodash')

const validators = require('../../../validators')

const filter = require('./common.filter')

const filterPrisonNumber = {
  ...cloneDeep(filter),
  id: 'filter.prison_number',
  name: 'filter.prison_number',
  label: {
    html: 'fields::filter.prison_number.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::filter.prison_number.hint',
  },
  validate: ['required', validators.prisonNumber],
}

module.exports = filterPrisonNumber
