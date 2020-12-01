const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateOfBirth = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'before'],
  label: {
    text: 'fields::date_of_birth.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::date_of_birth.hint',
  },
  id: 'date_of_birth',
  name: 'date_of_birth',
}

module.exports = dateOfBirth
