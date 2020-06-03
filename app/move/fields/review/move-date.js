const { cloneDeep } = require('lodash')

const commonDateField = require('../common.date')

const moveDate = {
  ...cloneDeep(commonDateField),
  dependent: {
    field: 'review_decision',
    value: 'approve',
  },
  hint: {
    text: 'fields::move_date.hint',
  },
  id: 'move_date',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::move_date.label',
  },
  name: 'move_date',
  skip: true,
  validate: [...commonDateField.validate, 'required', 'after'],
}

module.exports = moveDate
