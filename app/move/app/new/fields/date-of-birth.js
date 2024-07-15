const { cloneDeep } = require('lodash')

const { after } = require('../../../validators')

const commonDateField = require('./common.date')

const dateOfBirth = {
  ...cloneDeep(commonDateField),
  validate: [
    ...commonDateField.validate,
    { type: 'required' },
    { type: 'before' },
    {
      fn: after,
      message: 'Date of birth should be after 01/01/1900',
      arguments: ['1900-01-01'],
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
