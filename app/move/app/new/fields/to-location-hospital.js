const toLocation = require('./common.to-location')

const toLocationHospital = {
  ...toLocation,
  id: 'to_location_hospital',
  name: 'to_location_hospital',
  validate: 'required',
  label: {
    text: 'fields::to_location_hospital.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationHospital
