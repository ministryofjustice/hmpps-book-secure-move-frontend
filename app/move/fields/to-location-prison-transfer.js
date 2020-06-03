const toLocation = require('./common.to-location')

const toLocationPrisonTransfer = {
  ...toLocation,
  dependent: {
    field: 'move_type',
    value: 'prison_transfer',
  },
  id: 'to_location_prison_transfer',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::to_location_prison_transfer.label',
  },
  name: 'to_location_prison_transfer',
  validate: 'required',
}

module.exports = toLocationPrisonTransfer
