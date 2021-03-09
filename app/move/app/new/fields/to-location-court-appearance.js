const toLocation = require('./common.to-location')

const toLocationCourtAppearance = {
  ...toLocation,
  id: 'to_location_court_appearance',
  name: 'to_location_court_appearance',
  validate: 'required',
  label: {
    text: 'fields::to_location_court_appearance.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationCourtAppearance
