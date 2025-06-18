const dateChangedReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'date_changed_reason',
  fieldset: {
    legend: {
      text: 'fields::date_change_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'date_change_reason',
      value: 'combined_with_another_request',
      text: 'fields::date_change_reason.items.combined_with_another_request.label',
    },
    {
      value: 'operational_issues_prison',
      text: 'fields::date_change_reason.items.operational_issues_prison.label',
    },
    {
      value: 'tornado_event',
      text: 'fields::date_change_reason.items.tornado_event.label',
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::date_change_reason.items.cancelled_by_pmu.label',
    },
    {
      value: 'prisoner_refusal',
      text: 'fields::date_change_reason.items.prisoner_refusal.label',
    },
    {
      value: 'receiver_unable_to_accept_prisoner',
      text: 'fields::date_change_reason.items.receiver_unable_to_accept_prisoner.label',
    },
    {
      value: 'sender_unable_to_fulfil_draft',
      text: 'fields::date_change_reason.items.sender_unable_to_fulfil_draft.label',
    },
    {
      value: 'sender_cancelled_request',
      text: 'fields::date_change_reason.items.sender_cancelled_request.label',
    },
    {
      value: 'supplier_no_resource',
      text: 'fields::date_change_reason.items.supplier_no_resource.label',
    },
  ],
}

module.exports = dateChangedReason
