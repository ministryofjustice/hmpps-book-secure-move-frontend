const completeInFull = {
  validate: 'required',
  component: 'govukRadios',
  id: 'complete_in_full',
  name: 'complete_in_full',
  label: {
    text: 'fields::complete_in_full.label',
  },
  fieldset: {
    legend: {
      text: 'fields::complete_in_full.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
    },
    {
      value: 'false',
      text: 'No',
    },
  ],
}

module.exports = completeInFull
