const extraditionFlightStartTime = {
  id: 'extradition_flight__start_time',
  name: 'extradition_flight__start_time',
  validate: ['required'],
  component: 'govukInput',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  label: {
    html: 'fields::extradition_flight_time.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::extradition_flight_time.hint',
  },
}

module.exports = extraditionFlightStartTime
