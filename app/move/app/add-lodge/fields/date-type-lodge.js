const dateType = {
  validate: 'required, after',
  component: 'govukRadios',
  name: 'date_type',
  fieldset: {
    legend: {
      text: 'fields::date_type_lodge.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'date_type_lodge',
      value: 'tomorrow',
      text: 'fields::date_type.items.tomorrow.label',
    },
    {
      value: 'overmorrow',
      text: 'fields::date_type.items.overmorrow.label',
    },
    {
      value: 'custom',
      text: 'fields::date_type.items.another.label',
      conditional: 'date_custom_lodge',
    },
  ],
}

module.exports = dateType
