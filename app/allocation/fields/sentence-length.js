const sentenceLength = {
  validate: 'required',
  component: 'govukRadios',
  id: 'sentence_length',
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
      text: 'fields::sentence_length.items.length',
    },
    {
      value: 'short',
      text: 'fields::sentence_length.items.length_short',
    },
    {
      value: 'long',
      text: 'fields::sentence_length.items.length_long',
    },
    {
      value: 'other',
      text: 'fields::sentence_length.items.other',
      conditional: 'sentence_length_comment',
    },
  ],
}

module.exports = sentenceLength
