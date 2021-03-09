const lastName = {
  validate: 'required',
  component: 'govukInput',
  label: {
    text: 'fields::last_name.label',
    classes: 'govuk-label--s',
  },
  id: 'last_name',
  name: 'last_name',
  classes: 'govuk-input--width-20',
  autocomplete: 'off',
}

module.exports = lastName
