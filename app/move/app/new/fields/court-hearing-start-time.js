const { time: timeFormatter } = require('../../../../../common/formatters')
const { datetime: datetimeValidator, after } = require('../../../validators')

const courtHearingStartTime = {
  id: 'court_hearing__start_time',
  name: 'court_hearing__start_time',
  validate: ['required', datetimeValidator, after],
  formatter: [timeFormatter],
  component: 'govukInput',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  label: {
    html: 'fields::court_hearing__start_time.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::court_hearing__start_time.hint',
  },
}

module.exports = courtHearingStartTime
