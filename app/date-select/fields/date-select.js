/* eslint-disable camelcase */
const { cloneDeep } = require('lodash')

const commonDateField = require('../../move/fields/common.date')

const date_select = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required'],
  label: {
    text: 'fields::date_select.label',
    classes: 'govuk-label--s',
  },
  id: 'date_select',
  name: 'date_select',
}

module.exports = date_select
