const schemaExample = [
  {
    head: 'Move type',
    row: 'prison_transfer_reason',
  },
  {
    head: 'Age',
    row: 'age',
  },
]
const presenter = require('./object-to-table-head')
describe('table head presenter', function() {
  it('returns the heading specified', function() {
    const output = schemaExample.map(presenter)
    expect(output).to.deep.equal([
      {
        html: 'Move type',
      },
      {
        html: 'Age',
      },
    ])
  })
})
