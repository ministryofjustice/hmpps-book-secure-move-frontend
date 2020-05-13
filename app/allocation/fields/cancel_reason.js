const cancelReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'cancel_reason',
  label: {
    text: 'fields::cancel_reason.label',
  },
  fieldset: {
    legend: {
      text: 'fields::cancel_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'error',
      text: 'fields::cancel_allocation_reason.items.error',
    },
    {
      value: 'supplier_declined',
      text: 'fields::cancel_allocation_reason.items.supplier_declined',
    },
    {
      value: 'lack_of_space',
      text: 'fields::cancel_allocation_reason.items.lack_of_space',
    },
    {
      value: 'unfilled',
      text: 'fields::cancel_allocation_reason.items.unfilled',
    },
    {
      value: 'other',
      text: 'fields::cancel_allocation_reason.items.other',
      conditional: 'cancel_reason_comment',
    },
  ],
}

module.exports = cancelReason
