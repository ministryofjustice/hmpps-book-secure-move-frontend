const { cloneDeep } = require('lodash')

const filter = require('./common.filter')

const filterPrisonNumber = {
  ...cloneDeep(filter),
  id: 'filter.prison_number',
  name: 'filter.prison_number',
  label: {
    html: 'fields::filter.prison_number.label',
    classes: 'govuk-label--s',
  },
}

module.exports = filterPrisonNumber
