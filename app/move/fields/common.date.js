const { date: dateFormatter } = require('../../../common/formatters')

const date = {
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  component: 'govukInput',
  formatter: [dateFormatter],
  hint: {
    text: 'fields::date.hint',
  },
  validate: ['date'],
}

module.exports = date
