const toLocation = require('./common.to-location')

const toLocationExtradition = {
  ...toLocation,
  id: 'to_location_extradition',
  name: 'to_location_extradition',
  validate: 'required',
  label: {
    text: 'fields::to_location_extradition.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocationExtradition
