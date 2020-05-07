const _location = require('./_location')

const fromLocation = {
  ..._location,
  id: 'from_location',
  name: 'from_location',
  validate: 'required',
  label: {
    text: 'fields::from_location.label',
    classes: 'govuk-label--s',
  },
}

module.exports = fromLocation
