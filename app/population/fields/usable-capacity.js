const usableCapacity = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::usable_capacity.label',
    classes: 'govuk-label--s',
  },
  id: 'usable_capacity',
  name: 'usable_capacity',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = usableCapacity
