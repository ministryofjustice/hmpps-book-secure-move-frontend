const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateTo = {
  ...cloneDeep(commonDateField),
  skip: true,
  validate: [...commonDateField.validate, 'required', 'after'],
  dependent: {
    field: 'has_date_to',
    value: 'yes',
  },
  id: 'date_to',
  name: 'date_to',
  label: {
    text: 'fields::date_to.label',
    classes: 'govuk-label--s',
  },
}

module.exports = dateTo
