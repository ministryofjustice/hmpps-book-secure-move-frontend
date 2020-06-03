const { date: dateFormatter } = require('../../../common/formatters')

const date = {
  autocomplete: 'off',
  classes: 'govuk-input--width-10',
  component: 'govukInput',
  formatter: [dateFormatter],
  hint: {
    text: 'fields::date.hint',
  },
  id: 'date',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::date_of_allocation.label',
  },
  name: 'date',
  validate: ['date', 'required', 'after'],
}

module.exports = date
