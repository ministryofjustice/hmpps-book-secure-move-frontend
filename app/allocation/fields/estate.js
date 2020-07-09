const estate = {
  validate: 'required',
  component: 'govukRadios',
  name: 'estate',
  label: {
    text: 'fields::estate.label',
  },
  fieldset: {
    legend: {
      text: 'fields::estate.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'adult_female',
      text: 'fields::estate.items.adult_female',
      conditional: 'prisoner_other_category',
    },
    {
      value: 'adult_male',
      text: 'fields::estate.items.adult_male',
      conditional: 'prisoner_male_category',
    },
    {
      value: 'juvenile_female',
      text: 'fields::estate.items.juvenile_female',
    },
    {
      value: 'juvenile_male',
      text: 'fields::estate.items.juvenile_male',
    },
    {
      value: 'youth_female',
      text: 'fields::estate.items.youth_female',
      conditional: 'prisoner_other_category',
    },
    {
      value: 'youth_male',
      text: 'fields::estate.items.youth_male',
      conditional: 'prisoner_other_category',
    },
    {
      value: 'other',
      text: 'fields::estate.items.other',
      conditional: 'estate_other',
    },
  ],
}

module.exports = estate
