module.exports = {
  cancellation_reason: {
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
        text:
          'fields::cancellation_reason.items.supplier_declined_to_move.label',
        hint: {
          text:
            'fields::cancellation_reason.items.supplier_declined_to_move.hint',
        },
      },
      {
        value: 'other',
        text: 'fields::cancellation_reason.items.other.label',
        conditional: 'cancellation_reason_comment',
      },
    ],
  },
  cancellation_reason_comment: {
    validate: 'required',
    skip: true,
    rows: 3,
    component: 'govukTextarea',
    classes: 'govuk-input--width-20',
    label: {
      text: 'fields::cancellation_reason_comment.label',
      classes: 'govuk-label--s',
    },
    dependent: {
      field: 'cancellation_reason',
      value: 'other',
    },
  },
}
