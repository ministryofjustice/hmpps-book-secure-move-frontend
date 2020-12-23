const rebook = {
  validate: 'required',
  component: 'govukRadios',
  name: 'rebook',
  label: {
    text: 'fields::rebook.label',
  },
  fieldset: {
    legend: {
      text: 'fields::rebook.label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'true',
      text: 'fields::rebook.items.rebook_in_7_days',
    },
    {
      value: 'false',
      text: 'fields::rebook.items.rebook_in_7_days_only_if_required',
    },
    {
      value: 'false',
      text: 'fields::rebook.items.do_not_rebook',
    },
  ],
}

module.exports = rebook
