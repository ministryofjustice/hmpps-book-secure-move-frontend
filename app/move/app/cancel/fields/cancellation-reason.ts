export const cancellationReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'cancellation_reason',
  fieldset: {
    legend: {
      text: 'fields::cancellation_reason.label',
      classes: 'govuk-fieldset__legend--m'
    }
  },
  items: [
    {
      id: 'cancellation_reason',
      value: 'combined_with_another_request',
      text: 'fields::cancellation_reason.items.combined_with_another_request.label',
      move_types: ['prison_transfer']
    },
    {
      value: 'operational_issues_prison',
      text: 'fields::cancellation_reason.items.operational_issues_prison.label',
      move_types: ['prison_transfer']
    },
    {
      value: 'tornado_event',
      text: 'fields::cancellation_reason.items.tornado_event.label',
      move_types: ['prison_transfer']
    },
    {
      value: 'cancelled_by_pmu',
      text: 'fields::cancellation_reason.items.cancelled_by_pmu.label',
      conditional: 'cancellation_reason_cancelled_by_pmu_comment',
      move_types: ['prison_transfer']
    },
    {
      value: 'case_not_court_ready',
      text: 'fields::cancellation_reason.items.case_not_court_ready.label',
      move_types: ['other']
    },
    {
      value: 'court_closure',
      text: 'fields::cancellation_reason.items.court_closure.label',
      move_types: ['other']
    },
    {
      value: 'court_no_capacity',
      text: 'fields::cancellation_reason.items.court_no_capacity.label',
      move_types: ['other']
    },
    {
      value: 'court_not_dda_compliant',
      text: 'fields::cancellation_reason.items.court_not_dda_compliant.label',
      move_types: ['other']
    },
    {
      value: 'list_received_after_5_pm',
      text: 'fields::cancellation_reason.items.list_received_after_5_pm.label',
      move_types: ['other']
    },
    {
      value: 'incorrect_collection_location',
      text: 'fields::cancellation_reason.items.incorrect_collection_location.label',
      move_types: ['other']
    },
    {
      value: 'incorrect_final_location',
      text: 'fields::cancellation_reason.items.incorrect_final_location.label',
      move_types: ['other']
    },
    {
      value: 'police_transported_prisoner',
      text: 'fields::cancellation_reason.items.police_transported_prisoner.label',
      move_types: ['other']
    },
    {
      value: 'prison_transported_prisoner',
      text: 'fields::cancellation_reason.items.prison_transported_prisoner.label',
      move_types: ['other']
    },
    {
      value: 'prisoner_refusal',
      text: 'fields::cancellation_reason.items.prisoner_refusal.label',
      move_types: ['prison_transfer', 'other']
    },
    {
      value: 'receiver_unable_to_accept_prisoner',
      text: 'fields::cancellation_reason.items.receiver_unable_to_accept_prisoner.label',
      move_types: ['prison_transfer', 'other']
    },
    {
      value: 'sender_unable_to_fulfil_draft',
      text: 'fields::cancellation_reason.items.sender_unable_to_fulfil_draft.label',
      move_types: ['prison_transfer']
    },
    {
      value: 'sender_cancelled_request',
      text: 'fields::cancellation_reason.items.sender_cancelled_request.label',
      move_types: ['prison_transfer']
    },
    {
      value: 'supplier_no_resource',
      text: 'fields::cancellation_reason.items.supplier_no_resource.label',
      move_types: ['prison_transfer', 'other']
    },
    {
      value: 'prisoner_to_be_released_on_bail',
      text: 'fields::cancellation_reason.items.prisoner_to_be_released_on_bail.label',
      move_types: ['other']
    },
    {
      value: 'ptr_unachievable',
      text: 'fields::cancellation_reason.items.ptr_unachievable.label',
      move_types: ['other']
    },
    {
      value: 'prisoner_unfit_to_travel',
      text: 'fields::cancellation_reason.items.prisoner_unfit_to_travel.label',
      move_types: ['other']
    },
    {
      value: 'unsuitable_vehicle',
      text: 'fields::cancellation_reason.items.unsuitable_vehicle.label',
      move_types: ['other']
    },
    {
      value: 'video_link_to_be_used',
      text: 'fields::cancellation_reason.items.video_link_to_be_used.label',
      move_types: ['other']
    }
  ]
}
