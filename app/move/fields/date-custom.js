const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateCustom = {
  ...cloneDeep(commonDateField),
  dependent: {
    field: 'date_type',
    value: 'custom',
  },
  id: 'date_custom',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::date_custom.label',
  },
  name: 'date_custom',
  skip: true,
  validate: [...commonDateField.validate, 'required', 'after'],
}

module.exports = dateCustom
