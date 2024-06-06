const extraditionFlightNumber = {
  component: 'govukInput',
  label: {
    html: 'fields::extradition_flight_number.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::extradition_flight_number.hint',
  },
  id: 'extradition_flight_number',
  name: 'extradition_flight_number',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  validate: 'required',
}

module.exports = extraditionFlightNumber
