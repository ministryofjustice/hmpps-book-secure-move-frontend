const { date: dateFormatter } = require('../../../../../common/formatters')

const date = {
  validate: ['date'],
  formatter: [dateFormatter],
  component: 'mojDatePicker',
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  hint: {
    text: 'fields::date.hint',
  },
}

module.exports = date
