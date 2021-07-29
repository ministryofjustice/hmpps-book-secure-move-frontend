module.exports = {
  component: 'govukRadios',
  idPrefix: 'search_type',
  name: 'search_type',
  fieldset: {
    legend: {
      text: 'What would you like to search for?',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'move',
      text: 'A move',
      conditional: 'reference',
    },
    // {
    //   value: 'police_national_computer',
    //   text: 'By person',
    //   conditional: 'person_identifier',
    // },
    {
      value: 'person',
      text: 'A person',
      conditional: ['police_national_computer', 'prison_number'],
    },
    // {
    //   value: 'prison_number',
    //   text: 'By a person’s prison number',
    //   conditional: 'prison_number',
    // },
  ],
}
