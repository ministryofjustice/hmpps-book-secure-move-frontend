const moveAgreed = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      text: 'fields::move_agreed.label',
    },
  },
  items: [
    {
      conditional: 'move_agreed_by',
      id: 'move_agreed',
      text: 'Yes',
      value: 'true',
    },
    {
      text: 'No',
      value: 'false',
    },
  ],
  name: 'move_agreed',
  validate: 'required',
}

module.exports = moveAgreed
