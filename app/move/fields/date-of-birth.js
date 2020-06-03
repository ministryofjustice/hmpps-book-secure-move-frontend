const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const dateOfBirth = {
  ...cloneDeep(commonDateField),
  id: 'date_of_birth',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::date_of_birth.label',
  },
  name: 'date_of_birth',
  validate: [...commonDateField.validate, 'required', 'before'],
}

module.exports = dateOfBirth
