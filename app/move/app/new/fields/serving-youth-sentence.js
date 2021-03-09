const servingYouthSentence = {
  validate: 'required',
  component: 'govukRadios',
  name: 'serving_youth_sentence',
  fieldset: {
    legend: {
      text: 'fields::serving_youth_sentence.label',
      classes: 'govuk-visually-hidden govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'yes',
      text: 'Yes',
    },
    {
      value: 'no',
      text: 'No',
    },
  ],
}

module.exports = servingYouthSentence
