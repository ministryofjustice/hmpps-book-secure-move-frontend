const prisonerCategory = {
  validate: 'required',
  component: 'govukRadios',
  name: 'prisoner_male_category',
  label: {
    text: 'fields::prisoner_category.select_label',
  },
  fieldset: {
    legend: {
      text: 'fields::prisoner_category.select_label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'b',
      text: 'fields::prisoner_category.items.b',
    },
    {
      value: 'c',
      text: 'fields::prisoner_category.items.c',
    },
    {
      value: 'd',
      text: 'fields::prisoner_category.items.d',
    },
  ],
}

module.exports = prisonerCategory
