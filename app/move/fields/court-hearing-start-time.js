const { time: timeFormatter } = require('../formatters')
const { time: timeValidator } = require('../validators')

const courtHearingStartTime = {
  id: 'court_hearing__start_time',
  name: 'court_hearing__start_time',
  validate: ['required', timeValidator],
  formatter: [timeFormatter],
  component: 'govukInput',
  classes: 'govuk-input--width-10',
  autocomplete: 'off',
  skip: true,
  label: {
    html: 'fields::court_hearing__start_time.label',
    classes: 'govuk-label--s',
  },
  hint: {
    text: 'fields::court_hearing__start_time.hint',
  },
  dependent: {
    field: 'has_court_case',
    value: 'true',
  },
}

module.exports = courtHearingStartTime
