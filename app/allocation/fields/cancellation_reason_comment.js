const cancellationReasonComment = {
  validate: 'required',
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::cancellation_reason_comment.label',
    classes: 'govuk-label--s',
  },
}

module.exports = cancellationReasonComment
