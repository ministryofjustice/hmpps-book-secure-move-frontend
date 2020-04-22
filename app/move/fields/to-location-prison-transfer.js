const toLocation = require('./common.to-location')

const toLocationPrisonTransfer = {
  ...toLocation,
  id: 'to_location_prison_transfer',
  name: 'to_location_prison_transfer',
  validate: 'required',
  dependent: {
    field: 'move_type',
    value: 'prison_transfer',
  },
  label: {
    text: 'fields::to_location_prison_transfer.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationPrisonTransfer
