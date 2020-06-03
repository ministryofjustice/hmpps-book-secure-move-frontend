const people = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
      text: 'fields::people.label',
    },
  },
  formGroup: {
    classes: 'govuk-!-margin-bottom-2',
  },
  hint: {
    text: 'fields::people.hint',
  },
  items: [],
  name: 'people',
  validate: 'required',
}

module.exports = people
