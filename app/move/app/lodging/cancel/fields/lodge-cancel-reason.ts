export const lodgeCancelReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'lodge_cancel_reason',
  fieldset: {
    legend: {
      text: 'fields::lodge_cancel_reason.label',
      classes: 'govuk-label--m',
    },
  },
  items: [
    {
      id: 'lodge_cancel_reason',
      value: 'made_in_error',
      text: 'fields::lodge_cancel_reason.items.made_in_error.label',
      hint: {
        text: 'fields::lodge_cancel_reason.items.made_in_error.hint',
      },
    },
    {
      value: 'supplier_declined_to_move',
      text: 'fields::lodge_cancel_reason.items.supplier_declined_to_move.label',
      hint: {
        text: 'fields::lodge_cancel_reason.items.supplier_declined_to_move.hint',
      },
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::lodge_cancel_reason.items.cancelled_by_pmu.label',
    },
    {
      value: 'other',
      text: 'fields::lodge_cancel_reason.items.another.label',
      conditional: 'lodge_cancel_reason_custom',
    },
  ],
}
