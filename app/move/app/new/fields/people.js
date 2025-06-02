const people = {
  id: 'people',
  validate: 'required',
  component: 'govukRadios',
  items: [],
  name: 'people',
  formGroup: {
    classes: 'govuk-!-margin-bottom-2',
  },
  fieldset: {
    legend: {
      text: 'fields::people.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  hint: {
    text: 'fields::people.hint',
  },
}

module.exports = people
