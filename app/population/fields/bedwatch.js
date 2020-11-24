const bedwatch = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::bedwatch.label',
    classes: 'govuk-label--s',
  },
  id: 'bedwatch',
  name: 'bedwatch',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = bedwatch
