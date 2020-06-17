const rejectionReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'rejection_reason',
  skip: true,
  label: {
    text: 'fields::rejection_reason.label',
  },
  fieldset: {
    legend: {
      text: 'fields::rejection_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'no_space_at_receiving_prison',
      text: 'fields::rejection_reason.items.no_space_at_receiving_prison',
    },
    {
      value: 'no_transport_available',
      text: 'fields::rejection_reason.items.no_transport_available',
    },
  ],
  dependent: {
    field: 'review_decision',
    value: 'reject',
  },
}

module.exports = rejectionReason
