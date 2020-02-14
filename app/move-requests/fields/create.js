module.exports = {
  prison_number: {
    component: 'govukInput',
    label: {
      html: 'fields::prison_number.label',
      classes: 'govuk-label--s',
    },
    id: 'prison_number',
    name: 'prison_number',
    classes: 'govuk-input--width-20',
    autocomplete: 'off',
    validate: 'required',
  },
}
