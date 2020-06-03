const sentenceLength = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::sentence_length.label',
    },
  },
  items: [
    {
      text: 'fields::sentence_length.items.length',
      value: 'null',
    },
    {
      text: 'fields::sentence_length.items.length_short',
      value: 'short',
    },
    {
      text: 'fields::sentence_length.items.length_long',
      value: 'long',
    },
  ],
  label: {
    text: 'fields::sentence_length.label',
  },
  name: 'sentence_length',
  validate: 'required',
}

module.exports = sentenceLength
