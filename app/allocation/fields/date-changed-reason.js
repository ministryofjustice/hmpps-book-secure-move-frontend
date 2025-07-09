const i18n = require('../../../config/i18n').default

const label = `${i18n.t(`fields::date_changed_reason.label`, {
  objectType: 'allocation',
})}`

const dateChangedReason = {
  validate: 'required',
  component: 'govukRadios',
  name: 'date_changed_reason',
  objectType: 'allocation',
  fieldset: {
    legend: {
      text: label,
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      id: 'date_changed_reason',
      value: 'combined_with_another_request',
      text: 'fields::date_changed_reason.items.combined_with_another_request.label',
    },
    {
      value: 'operational_issues_prison',
      text: 'fields::date_changed_reason.items.operational_issues_prison.label',
    },
    {
      value: 'tornado_event',
      text: 'fields::date_changed_reason.items.tornado_event.label',
    },
    {
      value: 'amended_by_pmu',
      text: 'fields::date_changed_reason.items.amended_by_pmu.label',
    },
    {
      value: 'sender_unable_to_fulfil_draft',
      text: 'fields::date_changed_reason.items.sender_unable_to_fulfil_draft.label',
    },
    {
      value: 'supplier_no_resource',
      text: 'fields::date_changed_reason.items.supplier_no_resource.label',
    },
  ],
}

module.exports = dateChangedReason
