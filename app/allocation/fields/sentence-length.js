const sentenceLength = {
  validate: 'required',
  component: 'govukRadios',
  name: 'sentence_length',
  label: {
    text: 'fields::sentence_length.label',
  },
  fieldset: {
    legend: {
      text: 'fields::sentence_length.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'null',
      text: 'fields::sentence_length.items.any',
    },
    {
      value: 'short',
      text: 'fields::sentence_length.items.short',
    },
    {
      value: 'long',
      text: 'fields::sentence_length.items.long',
    },
  ],
}

module.exports = sentenceLength
