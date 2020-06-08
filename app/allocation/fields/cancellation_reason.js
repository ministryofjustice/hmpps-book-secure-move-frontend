const cancellationReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'cancellation_reason',
  label: {
    text: 'fields::cancellation_reason.label',
  },
  fieldset: {
    legend: {
      text: 'fields::cancellation_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'made_in_error',
      text: 'fields::cancel_allocation_reason.items.error',
    },
    {
      value: 'supplier_declined_to_move',
      text: 'fields::cancel_allocation_reason.items.supplier_declined',
    },
    {
      value: 'lack_of_space_at_receiving_establishment',
      text: 'fields::cancel_allocation_reason.items.lack_of_space',
    },
    {
      value: 'sending_establishment_failed_to_fill_allocation',
      text: 'fields::cancel_allocation_reason.items.unfilled',
    },
    {
      value: 'other',
      text: 'fields::cancel_allocation_reason.items.other',
      conditional: 'cancellation_reason_comment',
    },
  ],
}

module.exports = cancellationReason
