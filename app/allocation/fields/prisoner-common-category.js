const prisonerCategory = {
  validate: 'required',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::prisoner_common_category.select_label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'open',
      text: 'fields::prisoner_common_category.items.open',
    },
    {
      value: 'closed',
      text: 'fields::prisoner_common_category.items.closed',
    },
  ],
}

module.exports = prisonerCategory
