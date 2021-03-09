const { time: timeFormatter } = require('../../../../../common/formatters')
const { datetime: datetimeValidator, after } = require('../../../validators')

const timeDue = {
  id: 'time_due',
  name: 'time_due',
  validate: ['required', datetimeValidator, after],
  formatter: [timeFormatter],
  component: 'govukInput',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  label: {
    html: 'fields::time_due.label',
    classes: 'govuk-label--s',
  },
}

module.exports = timeDue
