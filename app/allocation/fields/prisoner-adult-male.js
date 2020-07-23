const prisonerCategory = {
  validate: 'required',
  component: 'govukRadios',
  id: 'prisoner_adult_male',
  name: 'prisoner_adult_male',
  label: {
    text: 'fields::prisoner_adult_male.select_label',
  },
  fieldset: {
    legend: {
      text: 'fields::prisoner_adult_male.select_label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'b',
      text: 'fields::prisoner_adult_male.items.b',
    },
    {
      value: 'c',
      text: 'fields::prisoner_adult_male.items.c',
    },
    {
      value: 'd',
      text: 'fields::prisoner_adult_male.items.d',
    },
  ],
}

module.exports = prisonerCategory
