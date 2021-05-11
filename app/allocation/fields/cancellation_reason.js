const cancellationReason = {
  validate: 'required',
  component: 'govukRadios',
  id: 'cancellation_reason',
  name: 'cancellation_reason',
  fieldset: {
    legend: {
      text: 'fields::cancel_allocation_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'made_in_error',
      text: 'fields::cancel_allocation_reason.items.made_in_error.label',
      hint: {
        text: 'fields::cancel_allocation_reason.items.made_in_error.hint',
      },
    },
    {
      value: 'supplier_declined_to_move',
      text: 'fields::cancel_allocation_reason.items.supplier_declined_to_move.label',
      hint: {
        text: 'fields::cancel_allocation_reason.items.supplier_declined_to_move.hint',
      },
    },
    {
      value: 'lack_of_space_at_receiving_establishment',
      text: 'fields::cancel_allocation_reason.items.lack_of_space.label',
    },
    {
      value: 'sending_establishment_failed_to_fill_allocation',
      text: 'fields::cancel_allocation_reason.items.unfilled.label',
    },
    {
      value: 'other',
      text: 'fields::cancel_allocation_reason.items.other.label',
      conditional: 'cancellation_reason_other_comment',
    },
  ],
}

module.exports = cancellationReason
