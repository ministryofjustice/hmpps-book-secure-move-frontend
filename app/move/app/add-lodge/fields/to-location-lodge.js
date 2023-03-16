const toLocation = require('../../new/fields/common.to-location')

const toLocationLodge = {
  ...toLocation,
  id: 'to_location_lodge',
  name: 'to_location_lodge',
  skip: false,
  validate: 'required',
  label: {
    text: 'fields::to_location_lodge.label',
    classes: 'govuk-label--s',
  },
}
module.exports = toLocationLodge
