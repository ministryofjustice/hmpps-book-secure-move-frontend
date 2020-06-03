const { time: timeFormatter } = require('../../../common/formatters')
const { datetime: datetimeValidator, after } = require('../validators')

const courtHearingStartTime = {
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  component: 'govukInput',
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
  formatter: [timeFormatter],
  hint: {
    text: 'fields::court_hearing__start_time.hint',
  },
  id: 'court_hearing__start_time',
  label: {
    classes: 'govuk-label--s',
    html: 'fields::court_hearing__start_time.label',
  },
  name: 'court_hearing__start_time',
  skip: true,
  validate: ['required', datetimeValidator, after],
}

module.exports = courtHearingStartTime
