const estate = {
  validate: 'required',
  component: 'govukRadios',
  id: 'estate',
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
      value: 'young_offender_female',
      text: 'fields::estate.items.young_offender_female',
      conditional: 'prisoner_young_offender_female',
    },
    {
      value: 'young_offender_male',
      text: 'fields::estate.items.young_offender_male',
      conditional: 'prisoner_young_offender_male',
    },
    {
      value: 'other_estate',
      text: 'fields::estate.items.other_estate',
      conditional: 'estate_comment',
    },
  ],
}

module.exports = estate
