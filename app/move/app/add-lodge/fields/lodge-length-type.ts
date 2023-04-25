export const lodgeLengthType = {
  validate: 'required',
  component: 'govukRadios',
  name: 'lodge_length_type',
  fieldset: {
    legend: {
      text: 'fields::lodge_length_type.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'lodge_length_type',
      value: '1',
      text: 'fields::lodge_length_type.items.one.label',
    },
    {
      value: '2',
      text: 'fields::lodge_length_type.items.two.label',
    },
    {
      value: 'custom',
      text: 'fields::lodge_length_type.items.another.label',
      conditional: 'lodge_length_custom',
    },
  ],
}
