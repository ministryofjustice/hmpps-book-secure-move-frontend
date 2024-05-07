const { gds_date: gdsDateFormatter } = require('../../../../../common/formatters')
const validators = require('../../../validators')

const date = {
  validate: [validators.gds_date],
  formatter: [gdsDateFormatter],
  component: 'govukDateInput',
  autocomplete: 'off',
  hint: {
    text: 'fields::date.hint',
  },
  items: [
    {
      name: "day",
      classes: "govuk-input--width-2",
      autocomplete: "off",
    },
    {
      name: "month",
      classes: "govuk-input--width-2",
      autocomplete: "off",
    },
    {
      name: "year",
      classes: "govuk-input--width-4",
      autocomplete: "off",
    }
  ]
}

module.exports = date

