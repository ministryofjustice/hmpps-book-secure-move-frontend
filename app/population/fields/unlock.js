const unlock = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::unlock.label',
    classes: 'govuk-label--s',
  },
  id: 'unlock',
  name: 'unlock',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = unlock
