const cancellationReason = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::cancellation_reason.label',
    },
  },
  items: [
    {
      hint: {
        text: 'fields::cancellation_reason.items.made_in_error.hint',
      },
      id: 'cancellation_reason',
      text: 'fields::cancellation_reason.items.made_in_error.label',
      value: 'made_in_error',
    },
    {
      hint: {
        text:
          'fields::cancellation_reason.items.supplier_declined_to_move.hint',
      },
      text: 'fields::cancellation_reason.items.supplier_declined_to_move.label',
      value: 'supplier_declined_to_move',
    },
    {
      conditional: 'cancellation_reason_comment',
      text: 'fields::cancellation_reason.items.other.label',
      value: 'other',
    },
  ],
  name: 'cancellation_reason',
  validate: 'required',
}

module.exports = cancellationReason
