const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateCustom = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required'],
  id: 'date_custom_lodge',
  name: 'date_custom_lodge',
  label: {
    text: 'fields::date_custom.label',
    classes: 'govuk-label--s',
  },
}

module.exports = dateCustom
