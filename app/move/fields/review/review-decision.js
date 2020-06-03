const reviewDecision = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::review_decision.label',
    },
  },
  items: [
    {
      conditional: 'move_date',
      id: 'review_decision',
      text: 'fields::review_decision.items.approve.label',
      value: 'approve',
    },
    {
      conditional: ['rejection_reason_comment'],
      text: 'fields::review_decision.items.reject.label',
      value: 'reject',
    },
  ],
  name: 'review_decision',
  validate: 'required',
}

module.exports = reviewDecision
