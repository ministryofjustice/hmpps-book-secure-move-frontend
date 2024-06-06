const { gds_time: timeFormatter } = require('../../../../../common/formatters')
const extraditionFlightTime = {
  id: 'extradition_flight_time',
  name: 'extradition_flight_time',
  formatter: [timeFormatter],
  validate: ['required'],
  component: 'govukInput',
  classes: 'govuk-input--width-4',
  autocomplete: 'off',
  label: {
    html: 'fields::extradition_flight_time.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::extradition_flight_time.hint',
  },
}

module.exports = extraditionFlightTime
