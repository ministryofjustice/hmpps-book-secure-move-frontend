const dateType = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      text: 'fields::date_type.label',
    },
  },
  items: [
    {
      id: 'date_type',
      text: 'fields::date_type.items.today.label',
      value: 'today',
    },
    {
      text: 'fields::date_type.items.tomorrow.label',
      value: 'tomorrow',
    },
    {
      conditional: 'date_custom',
      text: 'fields::date_type.items.another.label',
      value: 'custom',
    },
  ],
  name: 'date_type',
  validate: 'required',
}

module.exports = dateType
