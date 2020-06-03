const { cloneDeep } = require('lodash')

const filter = require('./common.filter')

const filterPoliceNationalComputer = {
  ...cloneDeep(filter),
  id: 'filter.police_national_computer',
  label: {
    classes: 'govuk-label--s',
    html: 'fields::filter.police_national_computer.label',
  },
  name: 'filter.police_national_computer',
}

module.exports = filterPoliceNationalComputer
