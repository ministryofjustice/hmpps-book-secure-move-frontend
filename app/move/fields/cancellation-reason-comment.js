const cancellationReasonComment = {
  id: 'cancellation_reason_comment',
  name: 'cancellation_reason_comment',
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
