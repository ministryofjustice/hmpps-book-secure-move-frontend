export const lodgeCancelReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'lodge_cancel_reason',
  fieldset: {
    legend: {
      text: 'fields::lodge_cancel_reason.label',
      classes: 'govuk-label--m'
    }
  },
  items: [
    {
      id: 'lodge_cancel_reason',
      value: 'combined_with_another_request',
      text: 'fields::lodge_cancel_reason.items.combined_with_another_request.label'
    },
    {
      value: 'operational_issues_prison',
      text: 'fields::lodge_cancel_reason.items.operational_issues_prison.label'
    },
    {
      value: 'tornado_event',
      text: 'fields::lodge_cancel_reason.items.tornado_event.label'
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::lodge_cancel_reason.items.cancelled_by_pmu.label'
    },
    {
      value: 'prisoner_refusal',
      text: 'fields::lodge_cancel_reason.items.prisoner_refusal.label'
    },
    {
      value: 'prisoner_unfit_to_travel',
      text: 'fields::lodge_cancel_reason.items.prisoner_unfit_to_travel.label'
    },
    {
      value: 'receiver_unable_to_accept_prisoner',
      text: 'fields::lodge_cancel_reason.items.receiver_unable_to_accept_prisoner.label'
    },
    {
      value: 'supplier_no_resource',
      text: 'fields::lodge_cancel_reason.items.supplier_no_resource.label'
    }
  ]
}
