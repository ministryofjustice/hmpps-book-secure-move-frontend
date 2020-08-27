const toLocation = require('./common.to-location')

const toLocationSecureChildrensHomeTransfer = {
  ...toLocation,
  id: 'to_location_secure_childrens_home',
  name: 'to_location_secure_childrens_home',
  validate: 'required',
  label: {
    text: 'fields::to_location_secure_childrens_home.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationSecureChildrensHomeTransfer
