const reviewDecision = {
  validate: 'required',
  component: 'govukRadios',
  name: 'review_decision',
  fieldset: {
    legend: {
      text: 'fields::review_decision.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'review_decision',
      value: 'approve',
      text: 'fields::review_decision.items.approve.label',
      conditional: 'move_date',
    },
    {
      value: 'reject',
      text: 'fields::review_decision.items.reject.label',
      conditional: ['rejection_reason_comment'],
    },
  ],
}

module.exports = reviewDecision
