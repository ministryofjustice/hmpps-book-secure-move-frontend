const operationalCapacity = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::operational_capacity.label',
    classes: 'govuk-label--s',
  },
  id: 'operational_capacity',
  name: 'operational_capacity',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = operationalCapacity
