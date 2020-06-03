const prisonerCategory = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::prisoner_category.label',
    },
  },
  items: [
    {
      text: 'B',
      value: 'B',
    },
    {
      text: 'C',
      value: 'C',
    },
    {
      text: 'D',
      value: 'D',
    },
  ],
  label: {
    text: 'fields::prisoner_category.label',
  },
  name: 'prisoner_category',
  validate: 'required',
}

module.exports = prisonerCategory
