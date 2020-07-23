const sentenceLengthComment = {
  id: 'sentence_length_comment',
  name: 'sentence_length_comment',
  validate: 'required',
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::sentence_length_comment.label',
    classes: 'govuk-label--s',
  },
}

module.exports = sentenceLengthComment
