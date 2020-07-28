const toLocation = require('./common.to-location')

const toLocationPoliceTransfer = {
  ...toLocation,
  id: 'to_location_police_transfer',
  name: 'to_location_police_transfer',
  validate: 'required',
  label: {
    text: 'fields::to_location_police_transfer.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationPoliceTransfer
