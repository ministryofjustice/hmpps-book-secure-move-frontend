const prisonTransferType = {
  component: 'govukRadios',
  fieldset: {
    legend: {
      classes: 'govuk-fieldset__legend--m',
      text: 'fields::prison_transfer_type.label',
    },
  },
  id: 'prison_transfer_type',
  items: [],
  name: 'prison_transfer_type',
  validate: 'required',
}

module.exports = prisonTransferType
