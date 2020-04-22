const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateCustom = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'after'],
  skip: true,
  dependent: {
    field: 'date_type',
    value: 'custom',
  },
  id: 'date_custom',
  name: 'date_custom',
  label: {
    text: 'fields::date_custom.label',
    classes: 'govuk-label--s',
  },
}

module.exports = dateCustom
