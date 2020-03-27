const i18n = require('../../config/i18n')
const presenter = require('./move-type-for-filter')

describe('move type for filter', function() {
  const testItems = [
    {
      id: 1,
      label: 'a',
    },
    {
      id: 2,
      label: 'b',
    },
  ]
  let output
  beforeEach(function() {
    sinon.stub(i18n, 't').returns('__translated__')
    output = presenter(testItems)
  })
  it('translates the label of every item', function() {
    expect(i18n.t).to.have.been.calledTwice
  })
  it('returns the items so modified', function() {
    expect(output).to.deep.equal([
      {
        id: 1,
        label: '__translated__',
      },
      {
        id: 2,
        label: '__translated__',
      },
    ])
  })
})
