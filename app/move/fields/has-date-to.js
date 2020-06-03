const hasDateTo = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-label--m',
      text: 'fields::has_date_to.label',
    },
  },
  items: [
    {
      conditional: 'date_to',
      text: 'Yes',
      value: 'yes',
    },
    {
      text: 'No',
      value: 'no',
    },
  ],
  name: 'has_date_to',
  validate: 'required',
}

module.exports = hasDateTo
