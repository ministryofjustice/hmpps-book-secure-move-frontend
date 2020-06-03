const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateFrom = {
  ...cloneDeep(commonDateField),
  id: 'date_from',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::date_from.label',
  },
  name: 'date_from',
  validate: [...commonDateField.validate, 'required', 'after'],
}

module.exports = dateFrom
