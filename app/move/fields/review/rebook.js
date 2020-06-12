const rebook = {
  validate: 'required',
  component: 'govukRadios',
  name: 'rebook',
  skip: true,
  label: {
    text: 'fields::rebook.label',
  },
  fieldset: {
    legend: {
      text: 'fields::rebook.label',
      classes: 'govuk-fieldset__legend--m',
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
  dependent: {
    field: 'review_decision',
    value: 'reject',
  },
}

module.exports = rebook
