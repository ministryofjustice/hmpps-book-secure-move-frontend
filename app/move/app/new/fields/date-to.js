const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date-picker')

const dateTo = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'after'],
  id: 'date_to',
  name: 'date_to',
  label: {
    text: 'fields::date_to.label',
    classes: 'govuk-label--s',
  },
}

module.exports = dateTo
