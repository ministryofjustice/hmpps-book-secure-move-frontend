export const lodgeLength = {
  validate: 'required',
  component: 'govukRadios',
  name: 'lodge_length',
  fieldset: {
    legend: {
      text: 'fields::lodge_length.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'lodge_length',
      value: '1',
      text: 'fields::lodge_length.items.one.label',
    },
    {
      value: '2',
      text: 'fields::lodge_length.items.two.label',
    },
    {
      value: 'custom',
      text: 'fields::lodge_length.items.another.label',
      conditional: 'lodge_length_custom',
    },
  ],
}
