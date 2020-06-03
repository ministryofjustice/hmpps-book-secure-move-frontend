const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateTo = {
  ...cloneDeep(commonDateField),
  dependent: {
    field: 'has_date_to',
    value: 'yes',
  },
  id: 'date_to',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::date_to.label',
  },
  name: 'date_to',
  skip: true,
  validate: [...commonDateField.validate, 'required', 'after'],
}

module.exports = dateTo
