const cancellationReasonComment = {
  validate: 'required',
  skip: true,
  rows: 3,
  component: 'govukTextarea',
  classes: 'govuk-input--width-20',
  label: {
    text: 'fields::cancellation_reason_comment.label',
    classes: 'govuk-label--s',
  },
  dependent: {
    field: 'cancellation_reason',
    value: 'other',
  },
}

module.exports = cancellationReasonComment
