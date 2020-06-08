const movesCount = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::moves_count.label',
    classes: 'govuk-label--s',
  },
  id: 'moves_count',
  name: 'moves_count',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
}

module.exports = movesCount
