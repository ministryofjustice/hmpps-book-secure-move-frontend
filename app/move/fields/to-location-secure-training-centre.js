const toLocation = require('./common.to-location')

const toLocationSecureTrainingCentreTransfer = {
  ...toLocation,
  id: 'to_location_secure_training_centre',
  name: 'to_location_secure_training_centre',
  validate: 'required',
  label: {
    text: 'fields::to_location_secure_training_centre.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationSecureTrainingCentreTransfer
