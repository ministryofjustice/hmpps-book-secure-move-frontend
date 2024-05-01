const { cloneDeep } = require('lodash')

const commonDateField = require('./common.date')

const extraditionFlightDate = {
  ...cloneDeep(commonDateField),
  validate: [...commonDateField.validate, 'required', 'before'],
  label: {
    text: 'fields::extradition_flight_date.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::extradition_flight_date.hint',
  },
  id: 'extradition_flight_date',
  name: 'extradition_flight_date',
}

module.exports = extraditionFlightDate
