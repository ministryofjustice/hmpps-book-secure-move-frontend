import { expect } from 'chai'

import addNegativeOption from './add-negative-option'

it('should process the fields correctly', function () {
  const fields = {
    theField: {
      items: [
        {
          value: 'test',
          text: 'Test',
        },
      ],
    },
  }
  const expectedFields = {
    theField: {
      items: [
        {
          value: 'test',
          text: 'Test',
        },
        {
          divider: 'or',
        },
        {
          behaviour: 'exclusive',
          text: 'No, this is not a test',
          value: 'none',
        },
      ],
      validate: [
        {
          message: 'Select if this is a test',
          type: 'required',
        },
      ],
    },
  }

  const result = addNegativeOption(
    fields,
    'theField',
    'No, this is not a test',
    'Select if this is a test'
  )

  expect(result).to.deep.equal(expectedFields)
})
