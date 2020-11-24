const overnightsIn = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::overnights_in.label',
    classes: 'govuk-label--s',
  },
  id: 'overnights_in',
  name: 'overnights_in',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = overnightsIn
