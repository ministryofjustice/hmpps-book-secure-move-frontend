const { cloneDeep } = require('lodash')

const commonDateField = require('../../../fields/common.date')

const moveDate = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'after'],
  id: 'move_date',
  name: 'move_date',
  label: {
    text: 'fields::move_date.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::move_date.hint',
  },
}

module.exports = moveDate
