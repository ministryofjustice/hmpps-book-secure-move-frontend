const outOfAreaCourts = {
  validate: ['required', 'numeric'],
  component: 'govukInput',
  label: {
    text: 'fields::out_of_area_courts.label',
    classes: 'govuk-label--s',
  },
  id: 'out_of_area_courts',
  name: 'out_of_area_courts',
  classes: 'govuk-input--width-5',
  autocomplete: 'off',
  inputmode: 'numeric',
  pattern: '[0-9]*',
}

module.exports = outOfAreaCourts
