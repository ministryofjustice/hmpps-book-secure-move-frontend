const estate = {
  validate: 'required',
  component: 'govukRadios',
  name: 'estate',
  label: {
    text: 'fields::estate.select_label',
  },
  fieldset: {
    legend: {
      text: 'fields::estate.select_label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'adult_female',
      text: 'fields::estate.items.adult_female',
      conditional: 'prisoner_adult_female',
    },
    {
      value: 'adult_male',
      text: 'fields::estate.items.adult_male',
      conditional: 'prisoner_adult_male',
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
      conditional: 'prisoner_youth_female',
    },
    {
      value: 'youth_male',
      text: 'fields::estate.items.youth_male',
      conditional: 'prisoner_youth_male',
    },
    {
      value: 'other',
      text: 'fields::estate.items.other',
      conditional: 'estate_comment',
    },
  ],
}

module.exports = estate
