const prisonTransferReason = {
  id: 'prison_transfer_reason',
  name: 'prison_transfer_reason',
  validate: 'required',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::prison_transfer_reason.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [],
}

module.exports = prisonTransferReason
