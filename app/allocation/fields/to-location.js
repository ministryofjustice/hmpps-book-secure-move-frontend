const { destinationDiffers } = require('../validators')

const _location = require('./_location')

const toLocation = {
  ..._location,
  id: 'to_location',
  name: 'to_location',
  validate: [
    { type: 'required' },
    {
      fn: destinationDiffers,
      arguments: ['from_location'],
      message: 'Location cannot be the same as the move from location',
    },
  ],
  label: {
    text: 'fields::to_location.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocation
