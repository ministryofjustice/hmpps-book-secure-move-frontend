const gender = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--s',
      text: 'fields::gender.label',
    },
  },
  items: [],
  name: 'gender',
  validate: 'required',
}

module.exports = gender
