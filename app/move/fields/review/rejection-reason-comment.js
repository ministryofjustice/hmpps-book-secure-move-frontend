const rejectionReasonComment = {
  classes: 'govuk-input--width-20',
  component: 'govukTextarea',
  dependent: {
    field: 'review_decision',
    value: 'reject',
  },
  label: {
    classes: 'govuk-label--s',
    text: 'fields::rejection_reason_comment.label',
  },
  name: 'rejection_reason_comment',
  rows: 3,
  skip: true,
}

module.exports = rejectionReasonComment
