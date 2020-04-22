const dateType = {
  validate: 'required',
  component: 'govukRadios',
  name: 'date_type',
  fieldset: {
    legend: {
      text: 'fields::date_type.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'date_type',
      value: 'today',
      text: 'fields::date_type.items.today.label',
    },
    {
      value: 'tomorrow',
      text: 'fields::date_type.items.tomorrow.label',
    },
    {
      value: 'custom',
      text: 'fields::date_type.items.another.label',
      conditional: 'date_custom',
    },
  ],
}

module.exports = dateType
