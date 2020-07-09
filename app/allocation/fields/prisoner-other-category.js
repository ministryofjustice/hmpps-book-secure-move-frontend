const prisonerCategory = {
  validate: 'required',
  component: 'govukRadios',
  name: 'prisoner_other_category',
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
      value: 'closed',
      text: 'fields::prisoner_category.items.open',
    },
    {
      value: 'open',
      text: 'fields::prisoner_category.items.closed',
    },
  ],
}

module.exports = prisonerCategory
