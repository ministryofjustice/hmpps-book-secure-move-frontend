const moveAgreed = {
  validate: 'required',
  component: 'govukRadios',
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
      value: 'yes',
      text: 'Yes',
      conditional: 'move_agreed_by',
    },
    {
      value: 'no',
      text: 'No',
    },
  ],
}

module.exports = moveAgreed
