const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date-picker')

const dateFrom = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'after'],
  id: 'date_from',
  name: 'date_from',
  label: {
    text: 'fields::date_from.label',
    classes: 'govuk-label--s',
  },
}

module.exports = dateFrom
