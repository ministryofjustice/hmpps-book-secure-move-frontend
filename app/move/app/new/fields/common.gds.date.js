const { date: dateFormatter } = require('../../../../../common/formatters')

const date = {
  validate: ['date'],
  formatter: [dateFormatter],
  component: 'govukDateInput',
  autocomplete: 'off',
  hint: {
    text: 'fields::date.hint',
  },
  items: [
    {
      name: 'day',
      classes: 'govuk-input--width-2',
      autocomplete: 'off',
    },
    {
      name: 'month',
      classes: 'govuk-input--width-2',
      autocomplete: 'off',
    },
    {
      name: 'year',
      classes: 'govuk-input--width-4',
      autocomplete: 'off',
    },
  ],
}

module.exports = date
