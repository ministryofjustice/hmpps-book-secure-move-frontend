const { cloneDeep } = require('lodash')

const commonDatePickerField = require('./common.date-picker')

const datePicker = {
  ...cloneDeep(commonDatePickerField),
  validate: [...commonDatePickerField.validate, 'required', 'after'],
  id: 'date',
  name: 'date',
  classes: 'govuk-input__wrapper',
  label: {
    text: 'fields::date_custom.label',
    classes: 'govuk-label--s',
  },
}

module.exports = datePicker
