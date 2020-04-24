const hasDateTo = {
  validate: 'required',
  component: 'govukRadios',
  name: 'has_date_to',
  fieldset: {
    legend: {
      text: 'fields::has_date_to.legend',
      classes: 'govuk-label--m',
    },
  },
  items: [
    {
      value: 'yes',
      text: 'Yes',
      conditional: 'date_to',
    },
    {
      value: 'no',
      text: 'No',
    },
  ],
}

module.exports = hasDateTo
