module.exports = {
  skip: true,
  component: 'govukRadios',
  idPrefix: 'person_identifier',
  name: 'person_identifier',
  fieldset: {
    legend: {
      text: 'How?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'police_national_computer',
      text: 'By PNC number',
      conditional: 'police_national_computer',
    },
    {
      value: 'prison_number',
      text: 'By prison number',
      conditional: 'prison_number',
    },
  ],
}
