const toLocation = require('./common.to-location')

const toLocationApprovedPremises = {
  ...toLocation,
  id: 'to_location_approved_premises',
  name: 'to_location_approved_premises',
  validate: 'required',
  label: {
    text: 'fields::to_location_approved_premises.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationApprovedPremises
