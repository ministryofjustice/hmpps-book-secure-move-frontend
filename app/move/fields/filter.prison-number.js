const { cloneDeep } = require('lodash')

const filter = require('./common.filter')

const filterPrisonNumber = {
  ...cloneDeep(filter),
  id: 'filter.prison_number',
  label: {
    classes: 'govuk-label--s',
    html: 'fields::filter.prison_number.label',
  },
  name: 'filter.prison_number',
}

module.exports = filterPrisonNumber
