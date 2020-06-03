const _location = require('./_location')

const toLocation = {
  ..._location,
  id: 'to_location',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::to_location.label',
  },
  name: 'to_location',
  validate: 'required',
}

module.exports = toLocation
