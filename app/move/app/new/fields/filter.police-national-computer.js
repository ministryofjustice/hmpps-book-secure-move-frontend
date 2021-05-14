const { cloneDeep } = require('lodash')

const validators = require('../../../validators')

const filter = require('./common.filter')

const filterPoliceNationalComputer = {
  ...cloneDeep(filter),
  id: 'filter.police_national_computer',
  name: 'filter.police_national_computer',
  label: {
    html: 'fields::filter.police_national_computer.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::filter.police_national_computer.hint',
  },
  validate: ['required', validators.policeNationalComputerNumber],
}

module.exports = filterPoliceNationalComputer
