const { date: dateFormatter } = require('../../../common/formatters')

const date = {
  component: 'mojDatePicker',
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  hint: {
    text: 'fields::date.hint',
  },
  validate: ['date', 'required', 'after'],
  formatter: [dateFormatter],
  id: 'date',
  name: 'date',
  label: {
    text: 'fields::date_of_allocation.label',
    classes: 'govuk-label--s',
  },
}

module.exports = date
