const hasOtherCriteria = {
  validate: 'required',
  component: 'govukRadios',
  id: 'has_other_criteria',
  name: 'has_other_criteria',
  label: {
    text: 'fields::has_other_criteria.label',
  },
  fieldset: {
    legend: {
      text: 'fields::has_other_criteria.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
      conditional: 'other_criteria',
    },
    {
      value: 'false',
      text: 'No',
    },
  ],
}

module.exports = hasOtherCriteria
