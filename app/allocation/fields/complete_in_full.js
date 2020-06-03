const completeInFull = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::complete_in_full.label',
    },
  },
  items: [
    {
      text: 'Yes',
      value: 'true',
    },
    {
      text: 'No',
      value: 'false',
    },
  ],
  label: {
    text: 'fields::complete_in_full.label',
  },
  name: 'complete_in_full',
  validate: 'required',
}

module.exports = completeInFull
