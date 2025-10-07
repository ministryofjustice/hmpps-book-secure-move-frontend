const rejectionReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'rejection_reason',
  label: {
    text: 'fields::rejection_reason.label',
  },
  fieldset: {
    legend: {
      text: 'fields::rejection_reason.label',
      classes: 'govuk-fieldset__legend--s',
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
    {
      value: 'more_info_required',
      text: 'fields::rejection_reason.items.more_info_required',
    },
  ],
}

module.exports = rejectionReason
