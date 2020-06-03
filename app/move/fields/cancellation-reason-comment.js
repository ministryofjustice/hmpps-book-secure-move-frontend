const cancellationReasonComment = {
  classes: 'govuk-input--width-20',
  component: 'govukTextarea',
  dependent: {
    field: 'cancellation_reason',
    value: 'other',
  },
  label: {
    classes: 'govuk-label--s',
    text: 'fields::cancellation_reason_comment.label',
  },
  rows: 3,
  skip: true,
  validate: 'required',
}

module.exports = cancellationReasonComment
