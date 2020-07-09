const prisonerCategory = {
  validate: 'required',
  component: 'govukRadios',
  name: 'prisoner_male_category',
  label: {
    text: 'fields::prisoner_male_category.label',
  },
  fieldset: {
    legend: {
      text: 'fields::prisoner_male_category.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'B',
      text: 'B',
    },
    {
      value: 'C',
      text: 'C',
    },
    {
      value: 'D',
      text: 'D',
    },
  ],
}

module.exports = prisonerCategory
