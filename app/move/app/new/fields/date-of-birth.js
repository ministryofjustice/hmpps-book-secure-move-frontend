const { cloneDeep } = require('lodash')

const { after1900 } = require('../../../validators')

const commonDateField = require('./common.date')

const dateOfBirth = {
  ...cloneDeep(commonDateField),
  validate: [
    ...commonDateField.validate,
    { type: 'required' },
    { type: 'before' },
    {
      fn: after1900,
      message: 'Date of birth should be after 01/01/1900',
    },
  ],
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
