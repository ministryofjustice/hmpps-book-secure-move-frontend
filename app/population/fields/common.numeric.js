const numeric = id => {
  return {
    validate: ['required', 'numeric'],
    component: 'govukInput',
    label: {
      text: `fields::${id}.label`,
      classes: 'govuk-label--s',
    },
    id: `${id}`,
    name: `${id}`,
    classes: 'govuk-input--width-5',
    autocomplete: 'off',
    inputmode: 'numeric',
    pattern: '[0-9]*',
  }
}

module.exports = numeric
