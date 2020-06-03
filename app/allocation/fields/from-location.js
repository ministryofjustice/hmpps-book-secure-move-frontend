const _location = require('./_location')

const fromLocation = {
  ..._location,
  id: 'from_location',
  label: {
    classes: 'govuk-label--s',
    text: 'fields::from_location.label',
  },
  name: 'from_location',
  validate: 'required',
}

module.exports = fromLocation
