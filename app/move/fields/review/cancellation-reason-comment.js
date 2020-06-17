const cancellationReasonComment = {
  name: 'cancellation_reason_comment',
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::cancellation_reason_comment.label',
    classes: 'govuk-label--s',
  },
  dependent: {
    field: 'review_decision',
    value: 'reject',
  },
}

module.exports = cancellationReasonComment
