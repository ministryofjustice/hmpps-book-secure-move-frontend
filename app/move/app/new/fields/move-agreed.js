const moveAgreed = {
  validate: 'required',
  component: 'govukRadios',
  id: 'move_agreed',
  name: 'move_agreed',
  fieldset: {
    legend: {
      text: 'fields::move_agreed.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'move_agreed',
      value: 'true',
      text: 'Yes',
      conditional: 'move_agreed_by',
    },
    {
      value: 'false',
      text: 'No',
    },
  ],
}

module.exports = moveAgreed
