const i18n = require('../../config/i18n')

const schemaExample = [
  {
    head: 'move_type::label',
    row: 'prison_transfer_reason',
  },
  {
    head: 'fields::age',
    row: 'age',
  },
]
const objectToTableHead = require('./object-to-table-head')

describe('table head presenter', function() {
  it('returns the heading specified', function() {
    sinon.stub(i18n, 't').returnsArg(0)
    const output = schemaExample.map(objectToTableHead)
    expect(output).to.deep.equal([
      {
        html: 'move_type::label',
      },
      {
        html: 'fields::age',
      },
    ])
  })
})
