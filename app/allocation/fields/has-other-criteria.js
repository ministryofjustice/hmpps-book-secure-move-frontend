const hasOtherCriteria = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::has_other_criteria.label',
    },
  },
  items: [
    {
      conditional: 'other_criteria',
      text: 'Yes',
      value: 'true',
    },
    {
      text: 'No',
      value: 'false',
    },
  ],
  label: {
    text: 'fields::has_other_criteria.label',
  },
  name: 'has_other_criteria',
  validate: 'required',
}

module.exports = hasOtherCriteria
