const { cloneDeep } = require('lodash')

const filter = require('./common.filter')

const filterPoliceNationalComputer = {
  ...cloneDeep(filter),
  id: 'filter.police_national_computer',
  name: 'filter.police_national_computer',
  label: {
    html: 'fields::filter.police_national_computer.label',
    classes: 'govuk-label--s',
  },
}

module.exports = filterPoliceNationalComputer
