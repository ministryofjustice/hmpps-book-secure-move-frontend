const ethnicity = {
  validate: 'required',
  component: 'govukSelect',
  label: {
    text: 'fields::ethnicity.label',
    classes: 'govuk-label--s',
  },
  id: 'ethnicity',
  name: 'ethnicity',
  classes: 'govuk-input--width-20',
  attributes: {
    'data-module': 'app-autocomplete',
  },
  items: [],
}

module.exports = ethnicity
