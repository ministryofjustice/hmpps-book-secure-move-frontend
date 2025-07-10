const { cloneDeep } = require('lodash')

const date = require('./date')

const changeDate = {
  ...cloneDeep(date),
  label: {
    text: 'fields::change_date_of_allocation.label',
    classes: 'govuk-label--s',
  },
}

module.exports = changeDate
