const toLocation = require('./common.to-location')

const toLocationCourtAppearance = {
  ...toLocation,
  dependent: {
    field: 'move_type',
    value: 'court_appearance',
  },
  id: 'to_location_court_appearance',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::to_location_court_appearance.label',
  },
  name: 'to_location_court_appearance',
  validate: 'required',
}

module.exports = toLocationCourtAppearance
