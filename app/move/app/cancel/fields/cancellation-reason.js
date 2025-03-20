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
      value: 'combined_with_another_request',
      text: 'fields::cancellation_reason.items.combined_with_another_request.label',
    },
    {
      value: 'operational_issues_prison',
      text: 'fields::cancellation_reason.items.operational_issues_prison.label',
    },
    {
      value: 'tornado_event',
      text: 'fields::cancellation_reason.items.tornado_event.label',
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::cancellation_reason.items.cancelled_by_pmu.label',
    },
    {
      value: 'prisoner_refusal',
      text: 'fields::cancellation_reason.items.prisoner_refusal.label',
    },
    {
      value: 'receiver_unable_to_accept_prisoner',
      text: 'fields::cancellation_reason.items.receiver_unable_to_accept_prisoner.label',
    },
    {
      value: 'receiver_unable_to_fulfil_draft',
      text: 'fields::cancellation_reason.items.receiver_unable_to_fulfil_draft.label',
    },
    {
      value: 'sender_cancelled_request',
      text: 'fields::cancellation_reason.items.sender_cancelled_request.label',
    },
    {
      value: 'supplier_no_resource',
      text: 'fields::cancellation_reason.items.supplier_no_resource.label',
    },
  ],
}
module.exports = cancellationReason
