const cancellationReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'cancellation_reason',
  fieldset: {
    legend: {
      text: 'fields::cancellation_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'cancellation_reason',
      value: 'made_in_error',
      text: 'fields::cancellation_reason.items.made_in_error.label',
      hint: {
        text: 'fields::cancellation_reason.items.made_in_error.hint',
      },
    },
    {
      value: 'supplier_declined_to_move',
      text: 'fields::cancellation_reason.items.supplier_declined_to_move.label',
      hint: {
        text: 'fields::cancellation_reason.items.supplier_declined_to_move.hint',
      },
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::cancellation_reason.items.cancelled_by_pmu.label',
      conditional: 'cancellation_reason_cancelled_by_pmu_comment',
    },
    {
      value: 'other',
      text: 'fields::cancellation_reason.items.other.label',
      conditional: 'cancellation_reason_other_comment',
    },
  ],
}

module.exports = cancellationReason
