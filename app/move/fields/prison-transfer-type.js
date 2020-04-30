const prisonTransferType = {
  id: 'prison_transfer_type',
  name: 'prison_transfer_type',
  validate: 'required',
  component: 'govukRadios',
  fieldset: {
    legend: {
      text: 'fields::prison_transfer_type.label',
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [],
}

module.exports = prisonTransferType
