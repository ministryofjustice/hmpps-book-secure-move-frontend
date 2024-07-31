const destinationDiffers = require('../validators.ts')

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
      message: 'To and from location must differ',
    },
  ],
  label: {
    text: 'fields::to_location.label',
    classes: 'govuk-label--s',
  },
}

module.exports = toLocation
