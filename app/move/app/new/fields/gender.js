const gender = {
  id: 'gender',
  validate: 'required',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::gender.label',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  name: 'gender',
  items: [],
}

module.exports = gender
