const _location = require('./_location')

const toLocation = {
  ..._location,
  id: 'to_location',
  name: 'to_location',
  validate: 'required',
  label: {
    text: 'fields::to_location.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocation
